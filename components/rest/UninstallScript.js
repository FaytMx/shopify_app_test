import { React, useState } from "react";
import { Banner, Form, TextField, Button, FormLayout } from "@shopify/polaris";

const UninstallScript = () => {
  const [active, setActive] = useState(false);

  const [id, setID] = useState("");

  const handleSubmit = (_event) => {
    console.log(id);

    fetch(`/uninstallScriptTag?id=${id}`).then((scriptTag) => {
      setActive(true);
      setID("");
    });
  };

  const handleScriptTagID = (value) => setID(value);

  if (active) {
    return <Banner title="You have uninstalled the script" status="success" />;
  } else {
    return (
      <>
        <Form noValidate onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              value={id}
              onChange={handleScriptTagID}
              label="Script Tag ID"
              type="number"
            />

            <Button submit>Submit</Button>
          </FormLayout>
        </Form>
      </>
    );
  }
};

export default UninstallScript;
