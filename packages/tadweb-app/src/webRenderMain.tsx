/*
 * main module for render process
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import OneRef, { mkRef, refContainer, StateRef } from "oneref";
import { AppState, AppPane, AppPaneBaseProps, PivotRequester } from "tadviewer";
import { ViewParams } from "tadviewer";
import { initAppState } from "tadviewer";
import * as reltab from "reltab";
import log from "loglevel";
import { WebTransportClient } from "./reltabWebClient";
import { DataSourceId, DataSourcePath, RemoteReltabConnection } from "reltab";

const testBaseUrl = "http://localhost:9000";
// const TEST_FILE = "movie_metadata.csv";

// const TEST_TABLE = "bigquery-public-data.covid19_jhu_csse.summary";
// const TEST_TABLE = "bigquery-public-data.github_repos.commits";
// const TEST_TABLE = "bigquery-public-data.iowa_liquor_sales.sales";
const TEST_TABLE = "movie_metadata";

/*
const openParams = {
  openType: "csv",
  targetPath: testTable + ".csv",
  fileContents: null,
  srcFile: null,
};
*/

const newWindowFromDSPath = (
  dsPath: DataSourcePath,
  stateRef: StateRef<AppState>
) => {
  // TODO! Generate a URL based on dsPath and call window.open(url, "_blank")
  console.log("TODO: newWindowFromDSPath: ", dsPath);
};

// TODO: figure out how to initialize based on saved views or different file / table names
const init = async () => {
  console.log("hello, Tad!");
  log.setLevel(log.levels.DEBUG);
  let targetPath: string = "";
  let srcFile = null;
  let viewParams: ViewParams | null = null;

  const appState = new AppState();
  const stateRef = mkRef(appState);
  const [App, listenerId] = refContainer<AppState, AppPaneBaseProps>(
    stateRef,
    AppPane
  );

  // const tableName = TEST_TABLE;
  // const rtc = new WebReltabConnection(testBaseUrl);

  // const tableName = await rtc.importFile(TEST_FILE);

  const wtc = new WebTransportClient(testBaseUrl);

  const rtc = new RemoteReltabConnection(wtc);

  var pivotRequester: PivotRequester | undefined | null = null;

  await initAppState(rtc, stateRef);

  const openURL = (url: string) => {
    window.open(url, "_blank");
  };

  ReactDOM.render(
    <App
      newWindow={newWindowFromDSPath}
      clipboard={navigator.clipboard}
      openURL={openURL}
    />,
    document.getElementById("app")
  );

  pivotRequester = new PivotRequester(stateRef);
};
init();
