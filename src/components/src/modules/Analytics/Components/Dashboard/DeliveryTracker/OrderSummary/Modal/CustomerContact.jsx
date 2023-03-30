import envelop from "../../../../../Assets/svgs/envelop.svg";
import place from "../../../../../Assets/svgs/place.svg";
import telephone from "../../../../../Assets/svgs/telephone.svg";

const CustomerContact = () => {
  return (
    <section className="customer__contact">
      <header>Customer Contact</header>
      <section>
        <div>
          <div className="item">
            <img src={envelop} alt="" />
            <span>olatstores@gmail.com</span>
          </div>
          <div className="item">
            <img src={telephone} alt="" />
            <span>08012345678</span>
          </div>
          <div className="item">
            <img src={place} alt="" />
            <span>46, Fatai Aremo Lane, Off Mr. Biggs, Ikeja Along, Lagos</span>
          </div>
        </div>
      </section>
    </section>
  );
};

export default CustomerContact;
