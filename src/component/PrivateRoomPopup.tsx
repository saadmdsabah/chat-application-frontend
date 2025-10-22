interface Props {
  onSendRequest: () => void;
  onCancel: () => void;
}

function PrivateRoomPopup({ onSendRequest, onCancel }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-sm w-full text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Private Room
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          This group is private. Would you like to send a join request?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onSendRequest}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition-all"
          >
            Send Request
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-600 text-white rounded-md transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PrivateRoomPopup;
