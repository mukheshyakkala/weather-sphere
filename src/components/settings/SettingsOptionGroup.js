export default function SettingsOptionGroup({ title, description, value, options, onChange }) {
  const optionList = Array.isArray(options) ? options : [];
  return (
    <section className="settings-option-group">
      <div><h3>{title}</h3><p>{description}</p></div>
      <div className="settings-options">
        {optionList.filter((option) => Array.isArray(option) && option.length >= 2).map(([option, label]) => (
          <button
            type="button"
            key={option}
            className={value === option ? "selected" : ""}
            aria-pressed={value === option}
            onClick={() => onChange(option)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}
