import type { InvestigationFlowItem, InvestigationFlowTrack } from "../types";
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

function FlowColumn({
  track,
  iconStart,
  showTail,
}: {
  track: InvestigationFlowTrack;
  iconStart: number;
  showTail: boolean;
}) {
  return (
    <div className="investigation-flow-track">
      {track.label ? (
        <p className="investigation-flow-track-label">
          <TextWithTerms text={track.label} />
        </p>
      ) : null}
      <div className="d-stack investigation-flow-track-steps">
        {track.steps.map((text, index) => (
          <div className="investigation-flow-item" key={index}>
            {index > 0 ? <FlowArrow /> : null}
            <FlowStep icon={defaultIcons[iconStart + index] ?? "eye"} text={text} />
          </div>
        ))}
      </div>
      {showTail ? (
        <div className="investigation-flow-track-tail" aria-hidden="true">
          <span className="investigation-flow-track-line" />
          <FlowArrow />
        </div>
      ) : null}
    </div>
  );
}

export function InvestigationFlow({ items }: { items: InvestigationFlowItem[] }) {
  let iconIndex = 0;

  return (
    <figure className="diagram">
      <figcaption className="kicker">FIGURE</figcaption>
      <div className="d-stack investigation-flow">
        {items.map((item, index) => {
          const prev = items[index - 1];
          const prevIsFork = prev !== undefined && typeof prev !== "string";
          const showLeadArrow = index > 0 && !prevIsFork;

          if (typeof item === "string") {
            const icon = defaultIcons[iconIndex] ?? "eye";
            iconIndex += 1;
            return (
              <div className="investigation-flow-item" key={index}>
                {showLeadArrow ? <FlowArrow /> : null}
                <FlowStep icon={icon} text={item} />
              </div>
            );
          }

          const startIcons = item.tracks.map((track) => {
            const start = iconIndex;
            iconIndex += track.steps.length;
            return start;
          });

          return (
            <div className="investigation-flow-item" key={index}>
              {showLeadArrow ? <FlowArrow /> : null}
              <div className="investigation-flow-fork">
                {item.tracks.map((track, trackIndex) => (
                  <FlowColumn
                    key={trackIndex}
                    track={track}
                    iconStart={startIcons[trackIndex] ?? 0}
                    showTail={index < items.length - 1}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}
