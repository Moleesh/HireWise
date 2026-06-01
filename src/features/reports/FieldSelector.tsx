/** @format */

import FrostedCard from '../../shared/components/FrostedCard';
import { reportFields } from './_private/fields';

type FieldSelectorProps = {
    selectedFieldKeys: string[];
    onToggleField: (fieldKey: string) => void;
};

/** FieldSelector - Column selector for reusable candidate exports. */
const FieldSelector = ({ selectedFieldKeys, onToggleField }: FieldSelectorProps) => (
    <FrostedCard className="p-4 md:p-5" hover={false}>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">Choose Fields</h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
            {selectedFieldKeys.length} columns selected
        </p>
        <div className="space-y-2">
            {reportFields.map((field) => (
                <label
                    key={field.key}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 cursor-pointer hover:bg-[var(--btn-ghost-hover)] transition-all"
                >
                    <input
                        type="checkbox"
                        checked={selectedFieldKeys.includes(field.key)}
                        onChange={() => onToggleField(field.key)}
                        className="accent-[var(--accent-bg)]"
                    />
                    <span className="text-sm text-[var(--text-secondary)]">{field.label}</span>
                </label>
            ))}
        </div>
    </FrostedCard>
);

export default FieldSelector;
