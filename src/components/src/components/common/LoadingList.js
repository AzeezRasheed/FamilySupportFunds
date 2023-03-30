import Loader from "react-loader-spinner";

export default function LoadingList() {
  return <center style={{marginTop: 30, marginBottom: 30}}>
  <Loader type="ThreeDots" color="#BBBDC2" height={30} width={30} />
  <Loader type="ThreeDots" color="#BBBDC2" height={30} width={30} />
  <Loader type="ThreeDots" color="#BBBDC2" height={30} width={30} />
  </center>;
}
