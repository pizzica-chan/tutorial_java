import type { IconName } from "./Icon";
import { Icon } from "./Icon";
import { TextWithTerms } from "./TextWithTerms";

const defaultIcons: IconName[] = ["globe", "terminal", "code", "eye", "search"];

function FlowArrow() {
  return (
    <div className="d-arrow down" aria-hidden="true">
      <i />
    </div>
  );
}

function FlowStep({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div className="d-layer has-icon investigation-flow-step">
      <Icon name={icon} size={18} />
      <span>
        <TextWithTerms text={text} />
      </span>
    </div>
  );
}

export function InvestigationFlow({ items }: { items: string[] }) {
  return (
    <figure className="diagram">
      <figcaption className="kicker">FIGURE</figcaption>
      <div className="d-stack investigation-flow">
        {items.map((text, index) => (
          <div className="investigation-flow-item" key={text}>
            {index > 0 ? <FlowArrow /> : null}
            <FlowStep icon={defaultIcons[index] ?? "eye"} text={text} />
          </div>
        ))}
      </div>
    </figure>
  );
}
