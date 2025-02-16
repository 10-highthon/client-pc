import { axiosInstance } from "./axios";

interface ChannelResponse {
  channelDescription: string;
  followerCount: number;
  openLive: boolean;
  channelId: string;
  channelName: string;
  channelImageUrl: string;
  verifiedMark: boolean;
  userAdultStatus: string;
  personalData: {
    privateUserBlock: true;
  };
}

interface ChannelsResponse {
  channels: ChannelResponse[];
}

interface LiveDetailResponse {
  channel: {
    channelId: string;
    channelName: string;
    channelImageUrl: string;
    verifiedMark: true;
    userAdultStatus: string;
  };
  videoUrl: string;
  closeDate: string;
  clipActive: boolean;
  chatActive: boolean;
  chatAvailableGroup: string;
  paidPromotion: boolean;
  chatAvailableCondition: string;
  minFollowerMinute: number;
  p2pQuality: string[];
  userAdultStatus: string;
  chatDonationRankingExposure: boolean;
  adParameter: {
    tag: string;
  };
  dropsCampaignNo: string;
  liveTitle: string;
  liveImageUrl: string;
  defaultThumbnailImageUrl: string;
  concurrentUserCount: number;
  accumulateCount: number;
  openDate: string;
  liveId: number;
  adult: boolean;
  tags: string[];
  chatChannelId: string;
  categoryType: string;
  liveCategory: string;
  liveCategoryValue: string;
}

interface LiveDetailsResponse {
  channels: LiveDetailResponse[];
}

interface SearchResponse {
  channels: ChannelResponse[];
}

export const searchChannels = async (query: string) => {
  const { data } = await axiosInstance.get<SearchResponse>("/favorite/search", {
    params: {
      query,
    },
  });

  return data;
};

export const getFavorites = async (channelId: string) => {
  const { data } = await axiosInstance.get<ChannelResponse>("/favorite", {
    params: {
      channelId,
    },
  });
  return data;
};

export const getFavoritesAll = async () => {
  const { data } = await axiosInstance.get<ChannelsResponse>("/favorite/all");
  return data;
};

export const getLiveDetail = async (channelId: string) => {
  const { data } = await axiosInstance.get<LiveDetailResponse>(
    "/favorite/live",
    {
      params: {
        channelId,
      },
    }
  );

  return data;
};

export const getLiveDetails = async () => {
  const { data } = await axiosInstance.get<LiveDetailsResponse>(
    "/favorite/live/all"
  );
  return data;
};

export const addFavorite = async (channelId: string) => {
  await axiosInstance.put("/favorite/add", { channelId });
};

export const removeFavorite = async (channelId: string) => {
  await axiosInstance.put("/favorite/remove", { channelId });
};
