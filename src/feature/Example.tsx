"use client";

import { useFlag } from "@openfeature/react-sdk";

export function FeatureFlagExample() {
  const { value: showNewMessage } = useFlag("new-message", false, {
    updateOnContextChanged: false,
  });
  return (
    <div className="App">
      <header className="App-header">
        {showNewMessage ? (
          <p>Welcome to this OpenFeature-enabled React app!</p>
        ) : (
          <p>Welcome to this React app.</p>
        )}
      </header>
    </div>
  );
}
