import { useEffect, useState } from "preact/hooks";
import { IconEllipsis } from "./components/icon/ellipsis.tsx";
import { IconSend } from "./components/icon/icon-send.tsx";
import { Textarea } from "./components/textarea/textarea.tsx";
import "./styles.css";
import { Fragment, h, render } from "preact";

type ChatMessage = {
  sender: "self" | "peer";
  content: string;
};

const demoMessages: Array<ChatMessage> = [
  {
    sender: "self",
    content: "Hi",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "Hi",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "Hi",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "Hi",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "Hi",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "Hi",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "self",
    content: "hello world",
  },
  {
    sender: "peer",
    content: "hello world",
  },
];

function App() {
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null);
  const [isBottom, setIsBottom] = useState<boolean>(true);
  const [messages, setMessages] = useState<Array<ChatMessage>>(() => demoMessages)
  const [input, setInput] = useState<string>('')

  useEffect(() => {
    if (!mainEl) return;
    mainEl.scrollTop = mainEl.scrollHeight;
    setIsBottom(true)
    const resizeObserver = new ResizeObserver(scrollToBottom);
    resizeObserver.observe(document.body)
  }, [mainEl]);

  useEffect(scrollToBottom, [messages])

  function onScroll(event: Event) {
    const elm = event.target as HTMLDivElement | null;
    if (!elm) return;
    const threshold = 10;
    setIsBottom(
      elm.scrollHeight - elm.scrollTop - elm.clientHeight < threshold,
    );
  }

  function scrollToBottom() {
    if (!isBottom) return;
    if (!mainEl) return;
    mainEl.scrollTop = mainEl.scrollHeight;
  }

  function onSubmit() {
    if (!input) return
    setMessages(msg => [...msg, { sender: 'self', content: input }])
    setInput('')
  }

  return (
    <Fragment>
      <nav className="navbar">
        <div>Basic Chat</div>
        <IconEllipsis />
      </nav>
      <main onScroll={onScroll} ref={setMainEl} className="chat-body">
        {messages.map((message) => (
          <div className={`chat-bubble ${message.sender}`}>
            <article>{message.content}</article>
          </div>
        ))}
      </main>
      <footer className="chat-entry">
        <Textarea
          onSubmit={onSubmit}
          onChange={(value) => {
            requestAnimationFrame(scrollToBottom);
            setInput(value)
          }}
          value={input}
          placeholder="Aa"
        />
        <button>
          <IconSend />
        </button>
      </footer>
    </Fragment>
  );
}

render(<App />, document.body);
