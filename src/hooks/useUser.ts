import { useContext } from "react";
import { AppContext } from "@/context/AppContext";

export const useUser = () => {
  const { user } = useContext(AppContext);
  return user;
};
