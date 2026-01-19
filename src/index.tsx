import "./styles.css";
import { Fragment, h, render } from "preact";
import { PreactRouter } from "./platform/router/preact.tsx";
import { AUTO_BASE_HREF } from "./platform/router/router.ts";
import { HomePage } from "./pages/home/home-page.tsx";
import { ChatPage } from "./pages/chat/chat-page.tsx";
import { NotFoundPage } from "./pages/not-found/not-found-page.tsx";
import { Provider } from "./platform/preact/provider.ts";
import { LMStudioService } from "./services/lmstudio-service.ts";
import { SideNavService } from "./services/side-nave-service.ts";
import { ChatInput } from "./components/chat-input/chat-input.tsx";
import { Icon } from "./components/icon/icon.tsx";
import { Button } from "./components/button/button.tsx";
import { Bubble } from "./components/bubble/bubble.tsx";
import { useEffect } from "preact/hooks";

const lmStudioService = new LMStudioService();

function App() {
  function toggleMenu() {
    document.body.classList.toggle("open");
  }

  return (
    <Fragment>
      <nav>
        <div className="top-bar">
          <h1>openchat</h1>
          <Button onClick={toggleMenu} className="menu-button">
            <Icon icon="bars" height="20px" />
          </Button>
        </div>
      </nav>
      <main>
        <nav>
          <Bubble>
            <Button onClick={toggleMenu} className="menu-button">
              <Icon icon="bars" height="18px" />
            </Button>
            <Button onClick={toggleMenu} className="menu-button">
              <Icon icon="gear" height="18px" />
            </Button>
          </Bubble>
        </nav>
        <footer>
          <ChatInput placeholder="Ask anything" />
        </footer>
      </main>
    </Fragment>
  );
}

render(<App />, document.body);

// DEBUG
//@ts-expect-error
globalThis.lm = lmStudioService;
