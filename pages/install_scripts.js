import React from 'react';
import {Page, Layout} from '@shopify/polaris';
import InstallScript from "../components/InstallScripts";
import UninstallScript from "../components/UninstallScript";


class ScriptTags extends React.Component {
render() {
    return (
        <Page>
        <Layout.AnnotatedSection
          title="Install Scripts"
          description="Install script tags by clicking the button"
        >
        <InstallScript></InstallScript>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title="Uninstall Scripts"
          description="Uninstall script by provading a specific script tag ID and clicking the submit button"
        >
        <UninstallScript></UninstallScript>
        </Layout.AnnotatedSection>
      </Page> 
    );
}
}

export default ScriptTags;