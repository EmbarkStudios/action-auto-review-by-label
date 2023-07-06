export interface GithubLabelEvent {
  action: string;
  label: {
    id: number;
    name: string;
  };
  repository: {
    name: string;
    owner: {
      login: string;
    };
  };
  pull_request: {
    number: number;
    title: string;
    body: string;
    head: {
      sha: string;
    };
    labels: {
      id: number;
      name: string;
    }[];
  };
}

export function parseGithubLabelEvent(eventPayload: string): GithubLabelEvent {
  let parsedEvent: unknown;

  try {
    parsedEvent = JSON.parse(eventPayload);
  } catch (error) {
    throw new Error(`Failed to parse Github event: ${error}`);
  }

  if (!isGithubLabelEvent(parsedEvent)) {
    throw new Error(`Invalid Github event: ${JSON.stringify(parsedEvent)}`);
  }

  return parsedEvent;
}

function isGithubLabelEvent(event: unknown): event is GithubLabelEvent {
  const labelEvent = event as GithubLabelEvent;

  return (
    typeof labelEvent.action === 'string' &&
    typeof labelEvent.label === 'object' &&
    typeof labelEvent.label.id === 'number' &&
    typeof labelEvent.label.name === 'string' &&
    typeof labelEvent.repository === 'object' &&
    typeof labelEvent.repository.name === 'string' &&
    typeof labelEvent.repository.owner === 'object' &&
    typeof labelEvent.repository.owner.login === 'string' &&
    typeof labelEvent.pull_request === 'object' &&
    typeof labelEvent.pull_request.number === 'number' &&
    Array.isArray(labelEvent.pull_request.labels)
  );
}
