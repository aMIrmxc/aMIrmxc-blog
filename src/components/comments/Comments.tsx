import { useState, useEffect } from "preact/hooks";
import type { ComponentProps } from "preact";
import { supabase } from "../../utils/supabase";
import authStore from "@/utils/authStore";
import { getMessages } from "../../utils/i18n";
import "../../styles/components/comments.css";

// Types
interface Comment {
  comment_text: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface Profile {
  first_name: string;
  last_name: string;
}

// Helper to format author name
const getAuthor = (profile: Profile | null) => {
  if (!profile) return "Anonymous";
  return `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Anonymous";
};

// FormattedDate component (simplified version)
function FormattedDate({ date, dir }: { date: Date; dir: "ltr" | "rtl" }) {
  return (
    <time dateTime={date.toISOString()}>
      {date.toLocaleDateString(dir === "rtl" ? "fa-IR" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </time>
  );
}

// Comment component
function CommentComponent({
  comment,
  dir,
  ...props
}: { comment: Comment; dir: "ltr" | "rtl" } & ComponentProps<"div">) {
  const author = getAuthor(comment.profiles as Profile);
  return (
    <div {...props} class="flex items-start space-x-4 my-16 text-xl font-bold" dir={dir}>
      <div class="flex-shrink-0">
        <img class="w-10 h-10 rounded-full" src="/user.png" alt={author} />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between">
          <span class="font-bold">{author}</span>
          <span class="text-l text-gray-500">
            <FormattedDate date={new Date(comment.created_at)} dir={dir} />
          </span>
        </div>
        <p class="my-8 comment-content">{comment.comment_text}</p>
      </div>
    </div>
  );
}

// Main Comments component
export default function Comments({ post_id, dir }: { post_id: string | any ; dir: "ltr" | "rtl" }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messages = getMessages(dir).comments;

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("comment_text, created_at, profiles (first_name, last_name)")
        .eq("post_id", post_id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error);
      } else if (data) {
        setComments(data as unknown as Comment[]);
      }
      setLoading(false);
    };

    fetchComments();
  }, [post_id]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (commentText.trim()) {
      try {
        const session = authStore.getSession();
        if (!session?.user) {
          const errorEvent = new CustomEvent("show-notification", {
            bubbles: true,
            composed: true,
            detail: { message: "Please sign in to comment.", isError: true },
          });
          document.dispatchEvent(errorEvent);
          setIsSubmitting(false);
          return;
        }

        const { data, error: insertError } = await supabase
          .from("comments")
          .insert({
            post_id: post_id,
            comment_text: commentText,
            user_id: session.user.id,
          })
          .select("*, profiles (first_name, last_name)")
          .single();

        if (insertError) throw insertError;

        if (data) {
          setComments([data as Comment, ...comments]);
          setCommentText("");
          const successEvent = new CustomEvent("show-notification", {
            bubbles: true,
            composed: true,
            detail: { message: messages.form.success },
          });
          document.dispatchEvent(successEvent);
        }
      } catch (err) {
        console.error("Error submitting comment:", err);
        const errorEvent = new CustomEvent("show-notification", {
            bubbles: true,
            composed: true,
            detail: { message: messages.form.error, isError: true },
          });
        document.dispatchEvent(errorEvent);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <section dir={dir} id="comments" class="max-w-8xl mt-32 w-full text-xl font-bold">
      <p class="mb-1 text-xl font-bold">{messages.title}</p>
      <form
        class="mb-16 mt-8 text-xl font-bold"
        onSubmit={handleSubmit}
        data-submitting-text={messages.form.submitting}
        data-success-text={messages.form.success}
        data-error-text={messages.form.error}
      >
        <div class="mb-4">
          <textarea
            id="comment"
            name="comment"
            rows={4}
            class="comment-textarea my-4 p-4 block text-2xl font-bold w-full h-64 rounded-md shadow-sm focus:border-accent focus:ring-accent"
            required
            placeholder={messages.form.comment}
            value={commentText}
            onInput={(e: preact.JSX.TargetedEvent<HTMLTextAreaElement, Event>) => setCommentText(e.currentTarget.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          class="my-4 inline-flex items-center rounded-md border border-transparent bg-accent px-4 py-2 text-white shadow-sm hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? messages.form.submitting : messages.form.submit}
        </button>
      </form>
      <div id="comments-list" class="mb-32 space-y-4">
        {loading && <div>{messages.loading}</div>}
        {error && <div class="text-red-500">{messages.error}</div>}
        {!loading && !error && comments.length === 0 && (
          <div class="text-gray-500">{messages.noComments}</div>
        )}
        {!loading && !error && comments.map((comment) => (
          <CommentComponent key={comment.created_at} comment={comment} dir={dir} />
        ))}
      </div>
    </section>
  );
}