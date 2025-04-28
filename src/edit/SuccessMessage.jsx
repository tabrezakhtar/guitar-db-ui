function SuccessMessage() {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">Success!</strong>
      <span className="block sm:inline"> Your changes have been saved.</span>
    </div>
  );
}

export default SuccessMessage;