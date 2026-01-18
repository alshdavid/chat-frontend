import "./chat-page.css";
import { Fragment, h } from "preact";
import { Textarea } from "../../components/textarea/textarea.tsx";
import { Markdown } from "../../components/markdown/markdown.tsx";
import { rx, notifyChange, useViewModel } from "../../../platform/rx/index.ts";
import { TextField } from "../../../platform/forms/index.ts";
import { useInject } from "../../provider.ts";
import { LMStudioService } from "../../services/lmstudio-service.ts";
import { Icon } from "../../components/icon/icon.tsx";
import { Router } from "../../../platform/router/router.ts";
import { useRouter } from "../../../platform/router/preact.tsx";
import { ScrollContainer } from "../../components/scroll-container/scroll-container.tsx";

type ChatMessage = {
  sender: "self" | "peer";
  content: string;
};

export class ChatPageVm extends EventTarget {
  @rx accessor draftText: TextField;
  @rx accessor connectionAddress: TextField;
  @rx accessor selectedModel: TextField;
  @rx accessor conversation: Array<ChatMessage>;
  @rx accessor assistantTyping: boolean;
  @rx accessor lmStudioService: LMStudioService;
  mainEl: HTMLElement | null;
  isBottom: boolean;
  router: Router;

  constructor(router: Router, lmStudioService: LMStudioService) {
    super();
    this.conversation = [];
    this.connectionAddress = new TextField();
    this.draftText = new TextField();
    this.selectedModel = new TextField();
    this.assistantTyping = false;
    this.mainEl = null;
    this.isBottom = false;
    this.lmStudioService = lmStudioService;
    this.router = router;
  }

  onInit() {
    if (!this.lmStudioService.isConnected()) {
      this.router.navigate("/");
    }
  }

  async submit() {
    if (this.assistantTyping) return;
    if (!this.draftText) return;

    this.conversation.push(
      {
        sender: "self",
        content: this.draftText.value,
      },
      {
        sender: "peer",
        content: "",
      },
    );

    this.draftText.update("");
    this.assistantTyping = true;

    const response = this.lmStudioService.streamChatCompletion({
      model: this.selectedModel.value,
      messages: this.conversation.map((msg) => ({
        role: msg.sender === "self" ? "user" : "assistant",
        content: msg.content,
      })),
      temperature: 0.7,
    });

    for await (const chunk of response) {
      this.conversation[this.conversation.length - 1].content += chunk;
      notifyChange(this);
    }

    this.assistantTyping = false;
  }
}

export function ChatPage() {
  const router = useRouter();
  const lmStudioService = useInject(LMStudioService);
  const vm = useViewModel(ChatPageVm, [router, lmStudioService]);

  return (
    <Fragment>
      <nav className="navbar">
        <div>Basic Chat</div>
        <Icon icon="ellipsis" height="24px" />
      </nav>
      <main className="chat-body">
        <ScrollContainer>
          {vm.conversation.map((message) => (
            <div className={`chat-bubble ${message.sender}`}>
              <Markdown contents={message.content} className="article" />
            </div>
          ))}
        </ScrollContainer>
      </main>
      <footer className="chat-entry">
        <Textarea
          onChange={vm.draftText.update}
          value={vm.draftText.value}
          placeholder="Aa"
        />
        <button onClick={() => vm.submit()}>
          <Icon icon="send" height="24px" />
        </button>
      </footer>
    </Fragment>
  );
}
