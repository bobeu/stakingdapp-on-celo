import React from "react";

export interface NotificationProps {
  message: string | JSX.Element;
  description: string | JSX.Element;
}

export interface PageProps {
  isUserAuthenticated: boolean;
  setauthentication: (x:boolean) => void;
}