function Spinner({ width = 12, height = 12 }) {
  return (
    <div className={`w-${width} h-${height} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
  )
}

export default Spinner;