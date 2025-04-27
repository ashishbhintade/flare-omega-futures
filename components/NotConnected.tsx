import ConnectWallet from "./ConnectButton";

export default function NotConnected() {
  return (
    <div className="flex items-center justify-center">
      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text"></div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Restore"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="mx-6">
          <h3 className="text-2xl font-semibold mb-4 mt-6 text-black">
            You Wallet is not Connected
          </h3>
          <p className="text-gray-600 text-lg mb-6 text-center">
            Please connect your wallet to proceed.
          </p>
        </div>
        <div className="flex justify-center mb-6">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
