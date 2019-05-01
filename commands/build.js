import { Text } from "ink";
import Spinner from "ink-spinner";
import React, { useEffect, useState } from "react";
import { clean, client, entry, server } from "..";

function Loading({ children, done }) {
  return (
    <Text>
      {!done && (
        <>
          <Spinner />{" "}
        </>
      )}
      {children} {done && "Done!"}
    </Text>
  );
}

async function run(opt) {
  process.env.NODE_ENV = opt.env;
  await clean(opt);
  await entry(opt);
  await Promise.all([client(opt), server(opt)]);
}

export default function Build(opt) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    run(opt).then(() => setDone(true));
  });
  return <Loading done={done}>Building...</Loading>;
}
