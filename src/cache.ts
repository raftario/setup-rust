import * as core from "@actions/core";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import * as path from "path";
import { parseRustToolchain } from "./misc";

const pjPath = path.join(__dirname, "..", "package.json");
// tslint:disable:no-var-requires
const pj = require(pjPath);

export async function restore(cargoPath: string, rustupPath: string, rustChannel: string, rustHost: string) {
  core.startGroup("Restore cache");

  const rustToolchain: string = parseRustToolchain(rustChannel, rustHost);

  const moveOptions: io.MoveOptions = {
    force: true,
  };

  // Restore cargo and rustup
  try {
    core.debug("Restoring cargo");
    const cachedCargoPath: string = tc.find("cargo", `${pj.version}-${rustToolchain}`);
    await io.mv(cachedCargoPath, cargoPath, moveOptions);
  } catch (error) {
    core.error(error.message);
  }
  try {
    core.debug("Restoring rustup");
    const cachedRustupPath: string = tc.find("rustup", `${pj.version}-${rustToolchain}`);
    await io.mv(cachedRustupPath, rustupPath, moveOptions);
  } catch (error) {
    core.error(error.message);
  }

  core.endGroup();
}

export async function cache(cargoPath: string, rustupPath: string, rustChannel: string, rustHost: string) {
  core.startGroup("Cache");

  const rustToolchain: string = parseRustToolchain(rustChannel, rustHost);

  // Cache .cargo and .rustup
  try {
    core.debug("Caching cargo");
    await tc.cacheDir(cargoPath, "cargo", `${pj.version}-${rustToolchain}`);
  } catch (error) {
    core.error(error.message);
  }
  try {
    core.debug("Caching rustup");
    await tc.cacheDir(rustupPath, "rustup", `${pj.version}-${rustToolchain}`);
  } catch (error) {
    core.error(error.message);
  }

  core.endGroup();
}