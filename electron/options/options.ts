import { screen } from "electron";

export const defaultPipOptions = (id: string) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  return {
    [id]: {
      size: {
        width: 480,
        height: 270,
      },
      location: {
        x: width - 530,
        y: height - 320,
      },
      volume: 0.5,
      opacity: 1,
    },
  };
};

export interface StoreOptions {
  autoStart: {
    [key: string]: {
      enabled: boolean;
      closed: boolean;
      status: boolean;
    };
  };

  pipOptions: {
    [key: string]: {
      size: {
        width: number;
        height: number;
      };
      location: {
        x: number;
        y: number;
      };
      volume: number;
      opacity: number;
    };
  };

  user: string;
  chzzkSession: string;
}
