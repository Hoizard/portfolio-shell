import { r as reactExports } from './index-Dm_EQZZA.js';
import { r as reactDomExports } from './index-COvqqES_.js';

true&&(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
}());

const buildIdentifier = "[0-9A-Za-z-]+";
const build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
const numericIdentifier = "0|[1-9]\\d*";
const numericIdentifierLoose = "[0-9]+";
const nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
const preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
const preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
const preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
const preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
const xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
const xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
const hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
const mainVersionLoose = `(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`;
const loosePlain = `[v=\\s]*${mainVersionLoose}${preReleaseLoose}?${build}?`;
const gtlt = "((?:<|>)?=?)";
const comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
const loneTilde = "(?:~>?)";
const tildeTrim = `(\\s*)${loneTilde}\\s+`;
const loneCaret = "(?:\\^)";
const caretTrim = `(\\s*)${loneCaret}\\s+`;
const star = "(<|>)?=?\\s*\\*";
const caret = `^${loneCaret}${xRangePlain}$`;
const mainVersion = `(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`;
const fullPlain = `v?${mainVersion}${preRelease}?${build}?`;
const tilde = `^${loneTilde}${xRangePlain}$`;
const xRange = `^${gtlt}\\s*${xRangePlain}$`;
const comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
const gte0 = "^\\s*>=\\s*0.0.0\\s*$";
function parseRegex(source) {
  return new RegExp(source);
}
function isXVersion(version) {
  return !version || version.toLowerCase() === "x" || version === "*";
}
function pipe(...fns) {
  return (x) => {
    return fns.reduce((v, f) => f(v), x);
  };
}
function extractComparator(comparatorString) {
  return comparatorString.match(parseRegex(comparator));
}
function combineVersion(major, minor, patch, preRelease2) {
  const mainVersion2 = `${major}.${minor}.${patch}`;
  if (preRelease2) {
    return `${mainVersion2}-${preRelease2}`;
  }
  return mainVersion2;
}
function parseHyphen(range) {
  return range.replace(
    parseRegex(hyphenRange),
    (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease) => {
      if (isXVersion(fromMajor)) {
        from = "";
      } else if (isXVersion(fromMinor)) {
        from = `>=${fromMajor}.0.0`;
      } else if (isXVersion(fromPatch)) {
        from = `>=${fromMajor}.${fromMinor}.0`;
      } else {
        from = `>=${from}`;
      }
      if (isXVersion(toMajor)) {
        to = "";
      } else if (isXVersion(toMinor)) {
        to = `<${+toMajor + 1}.0.0-0`;
      } else if (isXVersion(toPatch)) {
        to = `<${toMajor}.${+toMinor + 1}.0-0`;
      } else if (toPreRelease) {
        to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
      } else {
        to = `<=${to}`;
      }
      return `${from} ${to}`.trim();
    }
  );
}
function parseComparatorTrim(range) {
  return range.replace(parseRegex(comparatorTrim), "$1$2$3");
}
function parseTildeTrim(range) {
  return range.replace(parseRegex(tildeTrim), "$1~");
}
function parseCaretTrim(range) {
  return range.replace(parseRegex(caretTrim), "$1^");
}
function parseCarets(range) {
  return range.trim().split(/\s+/).map((rangeVersion) => {
    return rangeVersion.replace(
      parseRegex(caret),
      (_, major, minor, patch, preRelease2) => {
        if (isXVersion(major)) {
          return "";
        } else if (isXVersion(minor)) {
          return `>=${major}.0.0 <${+major + 1}.0.0-0`;
        } else if (isXVersion(patch)) {
          if (major === "0") {
            return `>=${major}.${minor}.0 <${major}.${+minor + 1}.0-0`;
          } else {
            return `>=${major}.${minor}.0 <${+major + 1}.0.0-0`;
          }
        } else if (preRelease2) {
          if (major === "0") {
            if (minor === "0") {
              return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${minor}.${+patch + 1}-0`;
            } else {
              return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${+minor + 1}.0-0`;
            }
          } else {
            return `>=${major}.${minor}.${patch}-${preRelease2} <${+major + 1}.0.0-0`;
          }
        } else {
          if (major === "0") {
            if (minor === "0") {
              return `>=${major}.${minor}.${patch} <${major}.${minor}.${+patch + 1}-0`;
            } else {
              return `>=${major}.${minor}.${patch} <${major}.${+minor + 1}.0-0`;
            }
          }
          return `>=${major}.${minor}.${patch} <${+major + 1}.0.0-0`;
        }
      }
    );
  }).join(" ");
}
function parseTildes(range) {
  return range.trim().split(/\s+/).map((rangeVersion) => {
    return rangeVersion.replace(
      parseRegex(tilde),
      (_, major, minor, patch, preRelease2) => {
        if (isXVersion(major)) {
          return "";
        } else if (isXVersion(minor)) {
          return `>=${major}.0.0 <${+major + 1}.0.0-0`;
        } else if (isXVersion(patch)) {
          return `>=${major}.${minor}.0 <${major}.${+minor + 1}.0-0`;
        } else if (preRelease2) {
          return `>=${major}.${minor}.${patch}-${preRelease2} <${major}.${+minor + 1}.0-0`;
        }
        return `>=${major}.${minor}.${patch} <${major}.${+minor + 1}.0-0`;
      }
    );
  }).join(" ");
}
function parseXRanges(range) {
  return range.split(/\s+/).map((rangeVersion) => {
    return rangeVersion.trim().replace(
      parseRegex(xRange),
      (ret, gtlt2, major, minor, patch, preRelease2) => {
        const isXMajor = isXVersion(major);
        const isXMinor = isXMajor || isXVersion(minor);
        const isXPatch = isXMinor || isXVersion(patch);
        if (gtlt2 === "=" && isXPatch) {
          gtlt2 = "";
        }
        preRelease2 = "";
        if (isXMajor) {
          if (gtlt2 === ">" || gtlt2 === "<") {
            return "<0.0.0-0";
          } else {
            return "*";
          }
        } else if (gtlt2 && isXPatch) {
          if (isXMinor) {
            minor = 0;
          }
          patch = 0;
          if (gtlt2 === ">") {
            gtlt2 = ">=";
            if (isXMinor) {
              major = +major + 1;
              minor = 0;
              patch = 0;
            } else {
              minor = +minor + 1;
              patch = 0;
            }
          } else if (gtlt2 === "<=") {
            gtlt2 = "<";
            if (isXMinor) {
              major = +major + 1;
            } else {
              minor = +minor + 1;
            }
          }
          if (gtlt2 === "<") {
            preRelease2 = "-0";
          }
          return `${gtlt2 + major}.${minor}.${patch}${preRelease2}`;
        } else if (isXMinor) {
          return `>=${major}.0.0${preRelease2} <${+major + 1}.0.0-0`;
        } else if (isXPatch) {
          return `>=${major}.${minor}.0${preRelease2} <${major}.${+minor + 1}.0-0`;
        }
        return ret;
      }
    );
  }).join(" ");
}
function parseStar(range) {
  return range.trim().replace(parseRegex(star), "");
}
function parseGTE0(comparatorString) {
  return comparatorString.trim().replace(parseRegex(gte0), "");
}
function compareAtom(rangeAtom, versionAtom) {
  rangeAtom = +rangeAtom || rangeAtom;
  versionAtom = +versionAtom || versionAtom;
  if (rangeAtom > versionAtom) {
    return 1;
  }
  if (rangeAtom === versionAtom) {
    return 0;
  }
  return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
  const { preRelease: rangePreRelease } = rangeAtom;
  const { preRelease: versionPreRelease } = versionAtom;
  if (rangePreRelease === void 0 && !!versionPreRelease) {
    return 1;
  }
  if (!!rangePreRelease && versionPreRelease === void 0) {
    return -1;
  }
  if (rangePreRelease === void 0 && versionPreRelease === void 0) {
    return 0;
  }
  for (let i = 0, n = rangePreRelease.length; i <= n; i++) {
    const rangeElement = rangePreRelease[i];
    const versionElement = versionPreRelease[i];
    if (rangeElement === versionElement) {
      continue;
    }
    if (rangeElement === void 0 && versionElement === void 0) {
      return 0;
    }
    if (!rangeElement) {
      return 1;
    }
    if (!versionElement) {
      return -1;
    }
    return compareAtom(rangeElement, versionElement);
  }
  return 0;
}
function compareVersion(rangeAtom, versionAtom) {
  return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
  return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
  switch (rangeAtom.operator) {
    case "":
    case "=":
      return eq(rangeAtom, versionAtom);
    case ">":
      return compareVersion(rangeAtom, versionAtom) < 0;
    case ">=":
      return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
    case "<":
      return compareVersion(rangeAtom, versionAtom) > 0;
    case "<=":
      return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
    case void 0: {
      return true;
    }
    default:
      return false;
  }
}
function parseComparatorString(range) {
  return pipe(
    parseCarets,
    parseTildes,
    parseXRanges,
    parseStar
  )(range);
}
function parseRange(range) {
  return pipe(
    parseHyphen,
    parseComparatorTrim,
    parseTildeTrim,
    parseCaretTrim
  )(range.trim()).split(/\s+/).join(" ");
}
function satisfy(version, range) {
  if (!version) {
    return false;
  }
  const parsedRange = parseRange(range);
  const parsedComparator = parsedRange.split(" ").map((rangeVersion) => parseComparatorString(rangeVersion)).join(" ");
  const comparators = parsedComparator.split(/\s+/).map((comparator2) => parseGTE0(comparator2));
  const extractedVersion = extractComparator(version);
  if (!extractedVersion) {
    return false;
  }
  const [
    ,
    versionOperator,
    ,
    versionMajor,
    versionMinor,
    versionPatch,
    versionPreRelease
  ] = extractedVersion;
  const versionAtom = {
    version: combineVersion(
      versionMajor,
      versionMinor,
      versionPatch,
      versionPreRelease
    ),
    major: versionMajor,
    minor: versionMinor,
    patch: versionPatch,
    preRelease: versionPreRelease == null ? void 0 : versionPreRelease.split(".")
  };
  for (const comparator2 of comparators) {
    const extractedComparator = extractComparator(comparator2);
    if (!extractedComparator) {
      return false;
    }
    const [
      ,
      rangeOperator,
      ,
      rangeMajor,
      rangeMinor,
      rangePatch,
      rangePreRelease
    ] = extractedComparator;
    const rangeAtom = {
      operator: rangeOperator,
      version: combineVersion(
        rangeMajor,
        rangeMinor,
        rangePatch,
        rangePreRelease
      ),
      major: rangeMajor,
      minor: rangeMinor,
      patch: rangePatch,
      preRelease: rangePreRelease == null ? void 0 : rangePreRelease.split(".")
    };
    if (!compare(rangeAtom, versionAtom)) {
      return false;
    }
  }
  return true;
}

const currentImports$1 = {};

// eslint-disable-next-line no-undef
const moduleMap = {'react':{get:()=>()=>__federation_import$1(new URL('__federation_shared_react-BCcI129A.js', import.meta.url).href),import:true},'react-dom':{get:()=>()=>__federation_import$1(new URL('__federation_shared_react-dom-BN8Au471.js', import.meta.url).href),import:true},'vue':{get:()=>()=>__federation_import$1(new URL('__federation_shared_vue-BzKvbPDO.js', import.meta.url).href),import:true}};
const moduleCache = Object.create(null);
async function importShared(name, shareScope = 'default') {
  return moduleCache[name]
    ? new Promise((r) => r(moduleCache[name]))
    : (await getSharedFromRuntime(name, shareScope)) || getSharedFromLocal(name)
}
// eslint-disable-next-line
async function __federation_import$1(name) {
  currentImports$1[name] ??= import(name);
  return currentImports$1[name]
}
async function getSharedFromRuntime(name, shareScope) {
  let module = null;
  if (globalThis?.__federation_shared__?.[shareScope]?.[name]) {
    const versionObj = globalThis.__federation_shared__[shareScope][name];
    const requiredVersion = moduleMap[name]?.requiredVersion;
    const hasRequiredVersion = !!requiredVersion;
    if (hasRequiredVersion) {
      const versionKey = Object.keys(versionObj).find((version) =>
        satisfy(version, requiredVersion)
      );
      if (versionKey) {
        const versionValue = versionObj[versionKey];
        module = await (await versionValue.get())();
      } else {
        console.log(
          `provider support ${name}(${versionKey}) is not satisfied requiredVersion(\${moduleMap[name].requiredVersion})`
        );
      }
    } else {
      const versionKey = Object.keys(versionObj)[0];
      const versionValue = versionObj[versionKey];
      module = await (await versionValue.get())();
    }
  }
  if (module) {
    return flattenModule(module, name)
  }
}
async function getSharedFromLocal(name) {
  if (moduleMap[name]?.import) {
    let module = await (await moduleMap[name].get())();
    return flattenModule(module, name)
  } else {
    console.error(
      `consumer config import=false,so cant use callback shared module`
    );
  }
}
function flattenModule(module, name) {
  // use a shared module which export default a function will getting error 'TypeError: xxx is not a function'
  if (typeof module.default === 'function') {
    Object.keys(module).forEach((key) => {
      if (key !== 'default') {
        module.default[key] = module[key];
      }
    });
    moduleCache[name] = module.default;
    return module.default
  }
  if (module.default) module = Object.assign({}, module.default, module);
  moduleCache[name] = module;
  return module
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production_min = {};

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f=reactExports,k=Symbol.for("react.element"),l=Symbol.for("react.fragment"),m$1=Object.prototype.hasOwnProperty,n=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,p={key:true,ref:true,__self:true,__source:true};
function q(c,a,g){var b,d={},e=null,h=null;void 0!==g&&(e=""+g);void 0!==a.key&&(e=""+a.key);void 0!==a.ref&&(h=a.ref);for(b in a)m$1.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps,a) void 0===d[b]&&(d[b]=a[b]);return {$$typeof:k,type:c,key:e,ref:h,props:d,_owner:n.current}}reactJsxRuntime_production_min.Fragment=l;reactJsxRuntime_production_min.jsx=q;reactJsxRuntime_production_min.jsxs=q;

{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}

var jsxRuntimeExports = jsxRuntime.exports;

var client = {};

var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}

const scriptRel = 'modulepreload';const assetsURL = function(dep) { return "https://hoizard.github.io/portfolio-shell/"+dep };const seen = {};const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (true && deps && deps.length > 0) {
    document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};

const remotesMap = {
'mfe_vue_tasks':{url:'https://hoizard.github.io/mfe-vue-tasks/dist/remoteEntry.js',format:'esm',from:'vite'},
  'mfe_angular_counter':{url:'https://hoizard.github.io/mfe-angular-counter/dist/remoteEntry.js',format:'esm',from:'vite'},
  'mfe_react_weather':{url:'https://hoizard.github.io/mfe-react-weather/dist/remoteEntry.js',format:'esm',from:'vite'}
};
                const currentImports = {};
                const loadJS = async (url, fn) => {
                    const resolvedUrl = typeof url === 'function' ? await url() : url;
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.onload = fn;
                    script.src = resolvedUrl;
                    document.getElementsByTagName('head')[0].appendChild(script);
                };

                function get(name, remoteFrom) {
                    return __federation_import(name).then(module => () => {
                        if (remoteFrom === 'webpack') {
                            return Object.prototype.toString.call(module).indexOf('Module') > -1 && module.default ? module.default : module
                        }
                        return module
                    })
                }
                
                function merge(obj1, obj2) {
                  const mergedObj = Object.assign(obj1, obj2);
                  for (const key of Object.keys(mergedObj)) {
                    if (typeof mergedObj[key] === 'object' && typeof obj2[key] === 'object') {
                      mergedObj[key] = merge(mergedObj[key], obj2[key]);
                    }
                  }
                  return mergedObj;
                }

                const wrapShareModule = remoteFrom => {
                  return merge({
                    'react':{'18.3.1':{get:()=>get(new URL('__federation_shared_react-BCcI129A.js', import.meta.url).href, remoteFrom), loaded:1}},'react-dom':{'18.3.1':{get:()=>get(new URL('__federation_shared_react-dom-BN8Au471.js', import.meta.url).href, remoteFrom), loaded:1}},'vue':{'3.5.30':{get:()=>get(new URL('__federation_shared_vue-BzKvbPDO.js', import.meta.url).href, remoteFrom), loaded:1}}
                  }, (globalThis.__federation_shared__ || {})['default'] || {});
                };

                async function __federation_import(name) {
                    currentImports[name] ??= import(name);
                    return currentImports[name]
                }

                async function __federation_method_ensure(remoteId) {
                    const remote = remotesMap[remoteId];
                    if (!remote.inited) {
                        if ('var' === remote.format) {
                            // loading js with script tag
                            return new Promise(resolve => {
                                const callback = () => {
                                    if (!remote.inited) {
                                        remote.lib = window[remoteId];
                                        remote.lib.init(wrapShareModule(remote.from));
                                        remote.inited = true;
                                    }
                                    resolve(remote.lib);
                                };
                                return loadJS(remote.url, callback);
                            });
                        } else if (['esm', 'systemjs'].includes(remote.format)) {
                            // loading js with import(...)
                            return new Promise((resolve, reject) => {
                                const getUrl = typeof remote.url === 'function' ? remote.url : () => Promise.resolve(remote.url);
                                getUrl().then(url => {
                                    import(/* @vite-ignore */ url).then(lib => {
                                        if (!remote.inited) {
                                            const shareScope = wrapShareModule(remote.from);
                                            lib.init(shareScope);
                                            remote.lib = lib;
                                            remote.lib.init(shareScope);
                                            remote.inited = true;
                                        }
                                        resolve(remote.lib);
                                    }).catch(reject);
                                });
                            })
                        }
                    } else {
                        return remote.lib;
                    }
                }

                function __federation_method_wrapDefault(module, need) {
                    if (!module?.default && need) {
                        let obj = Object.create(null);
                        obj.default = module;
                        obj.__esModule = true;
                        return obj;
                    }
                    return module;
                }

                function __federation_method_getRemote(remoteName, componentName) {
                    return __federation_method_ensure(remoteName).then((remote) => remote.get(componentName).then(factory => factory()));
                }

const React$1 = await importShared('react');
const {Suspense,lazy,useEffect,useRef} = React$1;

lazy(() => __federation_method_getRemote("mfe_vue_tasks" , "./TaskWidget").then(module=>__federation_method_wrapDefault(module, true)).then((m) => ({
  default: m.default ?? m
})));
const WeatherWidget = lazy(() => __federation_method_getRemote("mfe_react_weather" , "./WeatherWidget").then(module=>__federation_method_wrapDefault(module, true)).then((m) => ({
  default: m.default ?? m
})));
function CounterWidgetWrapper() {
  const ref = useRef(null);
  useEffect(() => {
    __federation_method_getRemote("mfe_angular_counter" , "./CounterWidget").then(module=>__federation_method_wrapDefault(module, true)).catch(console.error);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("counter-widget", { ref });
}
function MfePanel({ color, label, sublabel, mountId, children }) {
  const colors = {
    vue: { accent: "#42b883", bg: "rgba(66,184,131,0.08)", border: "rgba(66,184,131,0.25)" },
    angular: { accent: "#dd0031", bg: "rgba(221,0,49,0.06)", border: "rgba(221,0,49,0.22)" },
    react: { accent: "#149eca", bg: "rgba(20,158,202,0.07)", border: "rgba(20,158,202,0.22)" }
  };
  const c = colors[color];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
    border: `1px solid var(--border)`,
    borderTop: `2px solid ${c.accent}`,
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
      padding: "0.875rem 1.25rem",
      borderBottom: "1px solid var(--border-light)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: c.bg
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
        fontFamily: "var(--mono)",
        fontSize: "11px",
        fontWeight: 500,
        color: c.accent,
        border: `1px solid ${c.border}`,
        background: "rgba(255,255,255,0.7)",
        padding: "3px 9px",
        borderRadius: "4px",
        letterSpacing: "0.06em"
      }, children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontFamily: "var(--mono)", fontSize: "11px", color: "var(--hint)" }, children: sublabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, padding: "1.25rem" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "var(--mono)", fontSize: "12px", color: "var(--hint)", textAlign: "center", padding: "2rem 0" }, children: [
      "loading ",
      label,
      "…"
    ] }), children }) })
  ] });
}
function VueTaskWrapper() {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    __federation_method_getRemote("mfe_vue_tasks" , "./TaskWidget").then(module=>__federation_method_wrapDefault(module, true)).then(({ default: TaskWidget2 }) => {
      const { createApp } = window.__VUE__ ?? {};
      __vitePreload(async () => { const {createApp: createApp2} = await import('./__federation_shared_vue-BzKvbPDO.js');return { createApp: createApp2 }},true?[]:void 0).then(({ createApp: createApp2 }) => {
        const app = createApp2(TaskWidget2);
        app.mount(mountRef.current);
        return () => app.unmount();
      });
    }).catch(console.error);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: mountRef });
}
function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "nav", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#hero", className: "nav-logo", children: "EC" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#experience", className: "nav-link", children: "Experience" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#skills", className: "nav-link", children: "Skills" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#mfe-demo", className: "nav-link", children: "MFE Demo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#projects", className: "nav-link", children: "Projects" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#resume", className: "nav-link", children: "Resume" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#contact", className: "nav-cta", children: "Contact" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "hero", className: "hero-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "eyebrow", children: "Software Engineer II · Chicago, IL" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "hero-name", children: [
            "Erick Cruz",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: "Building things that scale." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hero-desc", children: "7+ years at Oak Street Health crafting enterprise .NET APIs, Vue 3 frontends, and microfrontend architectures. Focused on cloud, system design, and AI integration on the path to Senior Engineer." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-links", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#resume", className: "btn btn-primary", children: "View Resume" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#mfe-demo", className: "btn btn-outline", children: "Live MFE Demo →" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-stat", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-num", children: "7+" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Years at Oak Street Health" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-stat", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-num", children: "88%" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Doc signing increase (week 1)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-stat", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-num", children: "1K+" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label", children: "Users supported" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "experience", className: "section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-eyebrow", children: "Career" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Experience" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "exp-list", children: [
          {
            dates: "Apr 2022 – Present",
            role: "Software Engineer II",
            company: "Oak Street Health",
            bullets: [
              "Led microfrontend architecture migration to Vue 3 + Vite + Vitest.",
              "Built collaborative editing with streaming endpoints, Tanstack Query, and Pinia.",
              "Established Architecture Decision Records (ADRs) and frontend coding standards.",
              "Drove spike stories validating architectural and tooling decisions."
            ]
          },
          {
            dates: "Apr 2021 – Mar 2022",
            role: "Software Engineer",
            company: "Oak Street Health",
            bullets: [
              "Created a VueJS page that increased unsigned document signing by 88.46% (10,670 docs) in the first week.",
              "Implemented the first streaming service with RxJS — enabling clinical staff live task updates."
            ]
          },
          {
            dates: "Jun 2019 – Mar 2021",
            role: "Junior Application Developer",
            company: "Oak Street Health",
            bullets: [
              "Built Windows services for automated healthcare workflows and batch processing.",
              "Automated referral task flow via ASP.NET with electronic signatures."
            ]
          },
          {
            dates: "Jun 2017 – May 2019",
            role: "Computer Engineer",
            company: "Oak Street Health",
            bullets: [
              "Delivered deskside support for 1,000+ users including AD management and hardware."
            ]
          }
        ].map((job, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "exp-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "exp-meta", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "exp-dates", children: job.dates }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "exp-role", children: job.role }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "exp-company", children: job.company }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "exp-bullets", children: job.bullets.map((b, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, j)) })
          ] })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "skills", className: "section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-eyebrow", children: "Stack" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Skills & Technologies" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skills-grid", children: [
          { title: "Frontend", tags: ["Vue 3", "TypeScript", "JavaScript", "Pinia", "Tanstack Query", "Vite", "Tailwind CSS"] },
          { title: "Backend", tags: ["ASP.NET", "C#", "Entity Framework", "MS SQL", "Web API", "RxJS"] },
          { title: "Testing & Tooling", tags: ["Vitest", "Cypress", "Docker", "Cursor", "GitHub"] },
          { title: "Architecture", tags: ["Microfrontends", "ADRs", "Repository Pattern", "Streaming APIs", "SPA"] },
          { title: "Learning Now", tags: ["AWS", "Kubernetes", "Terraform", "Azure OpenAI", "Python"], accent: true },
          { title: "Domain", tags: ["Healthcare Tech", "Clinical Workflows", "Cross-team Leadership"] }
        ].map((group, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "skill-group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skill-group-title", children: group.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "skill-tags", children: group.tags.map((t, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `tag ${group.accent ? "tag-accent" : ""}`, children: t }, j)) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "mfe-demo", className: "section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-eyebrow", children: "Live Demo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Microfrontend Architecture" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-desc", children: "Three independent framework bundles — Vue 3, Angular-style Web Component, and React 18 — loaded at runtime via Module Federation. Each MFE lives in its own GitHub repo, deploys independently, and owns its state entirely." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mfe-wrapper", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mfe-arch-bar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-node arch-root", children: "portfolio-shell" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-arrow", children: "──▶" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-node arch-vue", children: "mfe-vue-tasks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-sep", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-node arch-ang", children: "mfe-angular-counter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-sep", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "arch-node arch-rea", children: "mfe-react-weather" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mfe-panels", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MfePanel, { color: "vue", label: "Vue 3", sublabel: "Composition API", mountId: "vue-mfe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(VueTaskWrapper, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MfePanel, { color: "angular", label: "Angular", sublabel: "Custom Element", mountId: "angular-mfe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CounterWidgetWrapper, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MfePanel, { color: "react", label: "React 18", sublabel: "Hooks + State", mountId: "react-mfe", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mfe-loading", children: "loading React MFE…" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(WeatherWidget, {}) }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "projects", className: "section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-eyebrow", children: "Portfolio" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Projects" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "projects-grid", children: [
          {
            icon: "🎮",
            name: "Gaming Stats Dashboard",
            status: "building",
            desc: "Real-time dashboard pulling stats from Steam & Riot Games APIs. AI-powered coaching tips via Azure OpenAI. End-to-end cloud deployment on AWS.",
            tech: ["Vue 3", "ASP.NET", "AWS EC2", "Docker", "Azure OpenAI", "PostgreSQL"]
          },
          {
            icon: "🔧",
            name: "AI Home Maintenance Tracker",
            status: "planned",
            desc: "Log tasks, track tools, get AI repair guides. Upload a photo of something broken — get step-by-step fix instructions via Azure AI Vision.",
            tech: ["Vue 3", "Semantic Kernel", "Azure AI Vision", "pgvector", "Service Bus"]
          },
          {
            icon: "🎵",
            name: "Smart Music Discovery",
            status: "planned",
            desc: "Connects to Spotify API, generates embeddings of your taste profile, and surfaces recommendations using vector similarity search.",
            tech: ["Vue 3", "FastAPI", "OpenAI Embeddings", "Pinecone", "Redis", "AWS Lambda"]
          },
          {
            icon: "⚡",
            name: "MFE Portfolio Shell",
            status: "live",
            desc: "This site. Vue 3, Angular-style Web Component, and React 18 loaded via Module Federation from separate GitHub repos — each deploying independently.",
            tech: ["Vue 3", "React 18", "Web Components", "Module Federation", "GitHub Pages"]
          }
        ].map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `project-card ${p.status === "live" ? "project-live" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-icon", children: p.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-name", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `project-status status-${p.status}`, children: p.status === "building" ? "In Progress" : p.status === "planned" ? "Planned" : "Live" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "project-desc", children: p.desc }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "project-tech", children: p.tech.map((t, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ptag", children: t }, j)) })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "resume", className: "section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-eyebrow", children: "Full Document" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Resume" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "resume-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "resume-header", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "resume-name", children: "Erick Cruz" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "resume-title", children: "Software Engineer II" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "resume-contact", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "erickcruz147@gmail.com" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "(773) 818-6161" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Chicago, IL" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "resume-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-section-title", children: "Experience" }),
              [
                {
                  title: "Software Engineer II",
                  dates: "Apr 2022 – Present",
                  company: "Oak Street Health",
                  bullets: ["Led microfrontend migration to Vue 3 + Vite + Vitest", "Built collaborative editing with streaming endpoints & Tanstack Query", "Established ADRs and frontend coding standards"]
                },
                {
                  title: "Software Engineer",
                  dates: "Apr 2021 – Mar 2022",
                  company: "Oak Street Health",
                  bullets: ["Increased doc signing by 88.46% (10,670 docs) in week one", "Built first streaming service with RxJS for live clinical updates"]
                },
                {
                  title: "Junior Application Developer",
                  dates: "Jun 2019 – Mar 2021",
                  company: "Oak Street Health",
                  bullets: ["Windows services for automated healthcare workflows", "Automated referral task flow via ASP.NET"]
                },
                {
                  title: "Computer Engineer",
                  dates: "Jun 2017 – May 2019",
                  company: "Oak Street Health",
                  bullets: ["Deskside support for 1,000+ users"]
                }
              ].map((job, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "res-job", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "res-job-header", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "res-job-title", children: job.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "res-job-dates", children: job.dates })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-job-company", children: job.company }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "res-bullets", children: job.bullets.map((b, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: b }, j)) })
              ] }, i)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-section-title", style: { marginTop: "1.5rem" }, children: "Education" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-edu-school", children: "Illinois Institute of Technology" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-edu-degree", children: "MS & BS in Software Development" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-edu-year", children: "Chicago, IL · May 2019" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-section-title", children: "Skills" }),
              [
                { label: "Frontend", tags: ["TypeScript", "JavaScript", "VueJS", "Pinia", "Tanstack Query", "Vite", "Tailwind CSS"] },
                { label: "Backend", tags: ["ASP.NET", "C#", "MS SQL", "Entity Framework"] },
                { label: "Testing", tags: ["Vitest", "Cypress"] },
                { label: "DevOps", tags: ["Docker", "Cursor"] }
              ].map((g, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "res-skill-group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-skill-label", children: g.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "res-skill-tags", children: g.tags.map((t, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "res-tag", children: t }, j)) })
              ] }, i))
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "contact", className: "section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "section-eyebrow", children: "Let's connect" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: "Get in Touch" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "contact-label", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:erickcruz147@gmail.com", className: "contact-val", children: "erickcruz147@gmail.com" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "contact-label", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "contact-val", children: "(773) 818-6161" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "contact-label", children: "Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "contact-val", children: "Chicago, IL" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "contact-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "contact-label", children: "Open To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "contact-val", children: "Senior Engineer roles" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-copy", children: "© 2025 Erick Cruz" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "footer-pills", children: ["Vue 3", "React 18", "Web Components", "Module Federation", "GitHub Pages"].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "footer-pill", children: t }, i)) })
    ] })
  ] });
}

const React = await importShared('react');
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
