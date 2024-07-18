<template>
  <q-scroll-area
    ref="scrollAreaRef"
    class="mx-auto rounded-md overflow-hidden"
    style="height: 85vh; max-width: 700px"
  >
    <div class="px-10">
      <q-chat-message
        v-for="(msg, index) in questions"
        :key="index"
        :sent="msg.sent"
        :text-color="msg.sent ? 'white' : 'black'"
        :bg-color="msg.sent ? 'green-6' : 'grey-3'"
      >
        <template #default>
          <div>
            <div v-html="formatMarkdown(msg.text || '')"></div>
            <q-badge v-if="msg.reference" color="blue-2" text-color="black">
              <small> <b>Reference:</b> {{ msg.reference }} </small>
            </q-badge>
            <img
              v-if="msg.image"
              :src="msg.image"
              class="rounded max-h-[300px]"
            />
          </div>
        </template>

        <template v-if="!msg.sent" #name>
          <span class="capitalize">
            {{ msg.name }}
          </span>
        </template>

        <template #stamp>{{ strFormatDistance(msg.stamp) }}</template>

        <template #avatar>
          <q-avatar v-if="!msg.sent" size="40px" class="mx-1" color="grey-4">
            <q-icon
              :name="msg.sent ? 'eva-person-outline' : 'eva-monitor-outline'"
              :color="msg.sent ? 'white' : 'black'"
            />
          </q-avatar>

          <q-avatar v-else color="green-6" size="30px" class="mx-1">
            <img
              v-if="msg.name?.avatar"
              :src="msg.name?.avatar"
              alt="User avatar"
            />
            <small v-else class="text-white">
              {{ msg?.name }}
            </small>
          </q-avatar>
        </template>
      </q-chat-message>

      <q-chat-message v-if="chat.loading" name="Bot" bg-color="grey-4">
        <template #avatar>
          <q-avatar size="40px" class="mx-1" color="grey-4">
            <q-icon name="eva-monitor-outline" color="black" />
          </q-avatar>
        </template>
        <q-spinner-dots size="2rem" />
      </q-chat-message>
    </div>
  </q-scroll-area>

  <div class="absolute bottom-8 w-full">
    <div class="max-w-[700px] mx-auto">
      <q-radio v-model="source" val="documents" label="Documents" />
      <q-radio v-model="source" val="database" label="Database" />
      <q-input
        standout
        v-model="question"
        placeholder="Type a question..."
        hide-bottom-space
        dense
        :disable="loading"
        ref="inputRef"
        autofocus
        autogrow
        class="no-uppercase w-full"
        @keyup.enter="chat.addQuestion()"
      >
        <template #after>
          <q-btn
            color="primary"
            icon="eva-paper-plane-outline"
            size="sm"
            unelevated
            padding="sm"
            :disable="loading || !question"
            @click="chat.addQuestion()"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import { storeToRefs } from "pinia";

const chat = useChatStore();

const {
  question,
  questions,
  scrollAreaRef,
  toInternalData,
  loading,
  inputRef,
  fileInput,
  source,
  image,
} = storeToRefs(chat);

onMounted(() => {
  setTimeout(() => {
    chat.scroll();
  }, 200);
});
</script>
