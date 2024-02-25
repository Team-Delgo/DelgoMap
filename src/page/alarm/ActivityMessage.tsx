import React from 'react';

function ActivityMessage({ message }: { message: string }) {
  const regex = /\[(.*?)\](.*)/;
  const matches = message.match(regex);

  if (matches) {
    const name = matches[1];
    const restOfMessage = matches[2];

    return (
      <p>
        <span style={{ fontWeight: 500 }}>{name}</span>
        {restOfMessage}
      </p>
    );
  } else {
    return <p>{message}</p>;
  }
}

export default ActivityMessage;
