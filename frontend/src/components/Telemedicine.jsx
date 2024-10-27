import React, { useEffect } from 'react';

const NLXChatWidget = () => {
  useEffect(() => {
    // Load the UMD script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@nlxai/chat-widget/lib/index.umd.js';
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize the widget once the script is loaded
      const widget = window.nlxai.chatWidget.create({
        config: {
          botUrl: "https://bots.dev.studio.nlx.ai/c/6gVupCE5FUzVWcB9AEumM/d8SnMUOcINSz5rH36KIF9",
          headers: {
            "nlx-api-key": "WDdTq4XLqGJ3ZxaGQg"
          },
          languageCode: "en-US"
        },
        titleBar: {
          title: "My Personal Medic",
          withCollapseButton: true,
          withCloseButton: true
        },
        onExpand: (conversationHandler) => {
          const checkMessages = (messages) => {
            if (messages.length === 0) {
              conversationHandler.sendWelcomeIntent();
            }
            conversationHandler.unsubscribe(checkMessages);
          };
          conversationHandler.subscribe(checkMessages);
        },
        theme: {
          primaryColor: "#2663da",
          darkMessageColor: "#2663da",
          lightMessageColor: "#EFEFEF",
          white: "#FFFFFF",
          fontFamily: "Helvetica",
          spacing: 17,
          borderRadius: 13,
          chatWindowMaxHeight: 640
        }
      });
    };

    // Cleanup function to remove the script when component unmounts
    return () => {
      document.body.removeChild(script);
      // Clean up the widget if needed
      if (window.nlxai && window.nlxai.chatWidget) {
        // Add any cleanup code here if the widget provides a cleanup method
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // The component doesn't need to render anything visible
  // The widget will be injected into the page by the script
  return null;
};

export default NLXChatWidget;