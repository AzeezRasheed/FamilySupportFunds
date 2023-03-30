import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../Admin/KPO/actions/UsersAction";
import { getAllDistributor } from "../Admin/pages/actions/adminDistributorAction";
import { filter } from "lodash";

export const GetDistributors = () => {
  const AuthData = useSelector((state) => state.Auth.sessionUserData);
  const country = AuthData?.country;
  const [myDistributors, setMyDistributors] = useState([]);
  const [distCodes, setDistCodes] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  const allDistributors = useSelector(
    (state) => state.AllDistributorReducer.all_distributors
  );
  const thisUser = useSelector((state) => state.Auth.sessionUserData);

  useEffect(() => {
    dispatch(getAllDistributor(country));
    dispatch(getSingleUser(AuthData?.email));
  }, []);

  useEffect(() => {
    Object.keys(thisUser).length > 0 &&
      setDistCodes(JSON.parse(thisUser?.DIST_Code));
    setLoaded(true);
  }, [thisUser]);

  let newArray = [];
  allDistributors.length > 0 &&
    distCodes &&
    distCodes.map((code) => {
      const thisDist = filter(allDistributors, { DIST_Code: code })[0];
      // console.log(thisDist);
      newArray.push(thisDist);
    });

  return newArray;
};
