const farsiMessages = {
  comments: {
    title: 'نظرات',
    form: {
      title: 'نظر خود را ثبت کنید',
      name: 'نام',
      email: 'ایمیل',
      website: 'وبسایت (اختیاری)',
      comment: 'نظر',
      submit: 'ارسال نظر',
      submitting: 'در حال ارسال...',
      success: 'نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.',
      error: 'خطایی در ارسال نظر رخ داد. لطفا دوباره تلاش کنید.',
    },
		loading: "در حال بارگذاری نظرات...",
		noComments: "هنوز نظری ثبت نشده است. اولین نفر باشید!",
		error: "خطا در دریافت نظرات. برای اطلاعات بیشتر کنسول را بررسی کنید.",
  },
};

const englishMessages = {
    comments: {
        title: "What is your opinion?",
        form: {
            title: "Leave a comment",
            name: "Name",
            email: "Email",
            website: "Website (optional)",
            comment: "Comment",
            submit: "Submit",
            submitting: "Submitting...",
            success: "Your comment has been submitted and will be displayed after approval.",
            error: "There was an error submitting your comment. Please try again.",
        },
        loading: "Loading comments...",
        noComments: "No comments yet. Be the first to comment!",
        error: "Error fetching comments. Visit console for more info.",
    }
};

export function getMessages(dir: 'ltr' | 'rtl') {
    return dir === 'rtl' ? farsiMessages : englishMessages;
}