import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../modules/Admin/KPO/actions/UsersAction";
import { getAllDistributor } from "../modules/Admin/pages/actions/adminDistributorAction";
import {filter} from "lodash"

export const GetMinAdminDistributors = () => {
    const AuthData = useSelector(state => state.Auth.sessionUserData);
    const ccountry = AuthData?.country;
    
    const [myDistributors, setMyDistributors] = useState([]);
    const [distCodes, setDistCodes] = useState([]);

    const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getAllDistributor(ccountry));
    dispatch(getSingleUser(AuthData.email));
  }, []);

  const allDistributors = useSelector(
    (state) => state.AllDistributorReducer.all_distributors
  );

  const thisUser = useSelector(state => state.Auth.sessionUserData);

  useEffect(() => {
    Object.keys(thisUser).length > 0 &&
      setDistCodes(JSON.parse(thisUser?.DIST_Code));
  }, [thisUser]);
  
  allDistributors.length > 0 &&
    distCodes &&
    distCodes.map((code) => {
      const thisDist = filter(allDistributors, { DIST_Code: code })[0];
      myDistributors.push(thisDist);
    });
   return myDistributors.length>0 && myDistributors;
};
