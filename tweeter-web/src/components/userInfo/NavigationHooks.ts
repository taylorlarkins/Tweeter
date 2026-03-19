import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "./UserInfoHooks";
import {
  NavigationPresenter,
  NavigationView,
} from "../../presenter/NavigationPresenter";
import { useRef } from "react";

interface UserNavigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

export const useUserNavigation = (): UserNavigation => {
  const { displayErrorMessage } = useMessageActions();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();

  const navigate = useNavigate();

  const listener: NavigationView = {
    setDisplayedUser: setDisplayedUser,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const presenterRef = useRef<NavigationPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new NavigationPresenter(listener);
  }

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    presenterRef.current!.navigateToUser(
      authToken!,
      displayedUser!,
      event.target.toString(),
    );
  };

  return {
    navigateToUser: (event: React.MouseEvent) => navigateToUser(event),
  };
};
