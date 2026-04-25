export default function Toggle({ on, onToggle, disabled = false }) {
  return (
    <button
      onClick={!disabled ? onToggle : undefined}
      className={`
        relative w-[50px] h-[28px] rounded-full flex-shrink-0
        transition-colors duration-300
        ${on ? 'bg-sage' : 'bg-mist'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full
          shadow-[0_2px_6px_rgba(0,0,0,0.2)]
          transition-all duration-300 cubic-bezier(0.34,1.56,0.64,1)
          ${on ? 'left-[25px]' : 'left-[3px]'}
        `}
      />
    </button>
  )
}
