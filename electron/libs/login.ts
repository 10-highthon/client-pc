import { BrowserWindow } from "electron";
import https from "https";

export async function getMyData(sessionCookie: string): Promise<{
  nickname: string;
  profileImageUrl: string;
  id: string;
  email: string;
}> {
  const headers = {
    cookie: sessionCookie ?? "",
  };

  const options = {
    hostname: "comm-api.game.naver.com",
    port: 443,
    path: "/nng_main/v1/user/getUserStatus",
    method: "GET",
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (response) => {
      const resData: {
        statusCode: number;
        body: string | string[];
      } = { statusCode: 500, body: [] };
      resData.statusCode = response.statusCode ?? 500;
      response.on("data", (chunk) => (resData.body as string[]).push(chunk));
      response.on("end", () => {
        resData.body = (resData.body as string[]).join("");

        if (resData.statusCode !== 200) {
          reject(new Error(`${resData.statusCode}`));
        } else {
          resolve(JSON.parse(resData.body).content);
        }
      });
    });

    req.on("error", (error) => reject(error));
    req.end();
  });
}

export async function loginAndGetSession() {
  const loginWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  let sessionCookie = "";

  loginWin.loadURL("https://chzzk.naver.com");
  loginWin.webContents.setAudioMuted(true);
  await loginWin.webContents.session.cookies
    .get({ url: "https://chzzk.naver.com" })
    .then((cookies) => {
      for (const cookie of cookies) {
        if (cookie.name === "NID_AUT") {
          sessionCookie = `${cookie.name}=${cookie.value};`;
        } else if (cookie.name === "NID_SES") {
          sessionCookie += `${cookie.name}=${cookie.value}`;
        }
      }
    });
  const myData = await getMyData(sessionCookie);
  if (!myData.nickname) sessionCookie = "";
  if (!sessionCookie) {
    loginWin.loadURL(
      "https://nid.naver.com/nidlogin.login?url=https%3A%2F%2Fchzzk.naver.com%2F"
    );
    loginWin.webContents.on("did-finish-load", () => {
      loginWin.webContents.executeJavaScript(`
        document.getElementById("keep").checked = true;
      `);
    });
    loginWin.show();
    await new Promise<void>((resolve) => {
      loginWin.webContents.on("did-navigate", async (event, url) => {
        if (url === "https://chzzk.naver.com/") {
          await loginWin.webContents.session.cookies
            .get({ url: "https://chzzk.naver.com" })
            .then((cookies) => {
              for (const cookie of cookies) {
                sessionCookie += `${cookie.name}=${cookie.value};`;
              }
            });
          resolve();
        }
      });
    });
  }
  loginWin.close();
  return sessionCookie;
}

export function logout() {
  const logoutWin = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  logoutWin.loadURL("https://chzzk.naver.com/");
  logoutWin.webContents.session.clearStorageData();
}
