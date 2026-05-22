/** @format */

import { Check, Copy } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

type ClipboardButtonProps = {
  text: string;
  className?: string;
  size?: number;
};

/** ClipboardButton - Button that copies text to clipboard with visual feedback. */
const ClipboardButton = ({ text, className = '', size = 16 }: ClipboardButtonProps) => {
  const { copied, copy } = useClipboard();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        copy(text);
      }}
      className={`
        inline-flex items-center justify-center rounded-lg p-1.5
        transition-all duration-200
        ${
          copied
            ? 'bg-emerald-500/20 text-emerald-400'
            : 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)]'
        }
        ${className}
      `}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? <Check size={size} /> : <Copy size={size} />}
    </button>
  );
};

export default ClipboardButton;
