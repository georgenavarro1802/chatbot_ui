import { defineStore } from "pinia";

export const useChatStore = defineStore("chat", () => {
  const loading = ref<boolean>(false);
  const scrollAreaRef = ref<any>(null);
  const inputRef = ref<any>(null);
  const fileInput = ref<any>(null);
  const toInternalData = ref<boolean>(false);

  const source = ref<string>("documents");

  type Message = {
    text?: string;
    sent?: boolean;
    name?: string;
    avatar?: string;
    stamp?: Date | string;
    loading?: boolean;
    image?: string;
    reference?: string;
  };

  const question = ref<string>("");
  const image = ref<string>("");

  const questions = ref<Message[]>([
    {
      text: "Hi! I'm a bot. Ask me anything",
      sent: false,
      name: "Bot",
      stamp: new Date(),
    },
  ]);

  // add a new question
  const addQuestion = () => {
    if (question.value.trim() === "") return;

    questions.value.push({
      text: question.value,
      sent: true,
      name: "Me",
      image: image.value,
      stamp: new Date(),
    });

    sendQuestionAWS(question.value);
    question.value = "";
    image.value = "";

    setTimeout(() => {
      scroll();
    }, 500);
  };

  const scroll = () => {
    if (scrollAreaRef.value) {
      scrollAreaRef.value.setScrollPosition(
        "vertical",
        questions.value.length * 600
      );
    }
  };

  async function sendQuestion(q: string) {
    loading.value = true;

    try {
      const imageTemp = image.value;

      const res = await $fetch<any>("/api/math", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { image: imageTemp, query: q },
      });

      questions.value.push({
        text: res?.message || "Sorry, I don't understand that question",
        sent: false,
        name: "Bot",
        stamp: new Date(),
      });
    } catch (_) {
      questions.value.push({
        text: "Sorry, I don't understand that question",
        sent: false,
        name: "Bot",
        stamp: new Date(),
      });
    }

    loading.value = false;

    // input focus
    if (inputRef.value) {
      setTimeout(() => {
        scroll();
        inputRef.value?.focus();
      }, 200);
    }
  }

  async function sendQuestionAWS(q: string) {
    loading.value = true;

    try {
      const res = await $fetch<any>(
        "https://5kmnem4jtjyewbmnsyvcegg5jy0xezhj.lambda-url.us-east-1.on.aws/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: { question: q, source: source.value },
        }
      );

      questions.value.push({
        text: res?.response || "Sorry, I don't understand that question",
        sent: false,
        name: "Bot",
        stamp: new Date(),
        reference: res?.reference,
      });
    } catch (_) {
      questions.value.push({
        text: "Sorry, I don't understand that question",
        sent: false,
        name: "Bot",
        stamp: new Date(),
      });
    }

    loading.value = false;

    // input focus
    if (inputRef.value) {
      setTimeout(() => {
        scroll();
        inputRef.value?.focus();
      }, 200);
    }
  }

  function handleClick() {
    fileInput.value?.click();
  }

  async function handleFileChange(e: any) {
    const temp = e.target.files[0];
    const base64: any = await fileToBase64(temp);
    image.value = base64;
  }

  return {
    loading,
    question,
    questions,
    addQuestion,
    scrollAreaRef,
    scroll,
    toInternalData,
    inputRef,
    image,
    handleClick,
    handleFileChange,
    fileInput,
    source,
  };
});
