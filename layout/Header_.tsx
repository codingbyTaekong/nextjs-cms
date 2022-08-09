import React from "react";
import style from "../styles/header.module.css"

const Header = () => {
  return (
    <div className={style.sidebar}>
      <div className={style.logo_details}>
        {/* <i className='bx bxl-c-plus-plus icon'></i> */}
        <div className={style.logo_name}>CodingLab</div>
        {/* <i className='bx bx-menu' id="btn" ></i> */}
      </div>
      <ul className={style.nav_list}>
        <li>
          {/* <i className='bx bx-search' ></i> */}
          <input type="text" placeholder="Search..." />
          <span className={style.tooltip}>Search</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-grid-alt'></i> */}
            <span className={style.links_name}>Dashboard</span>
          </a>
          <span className={style.tooltip}>Dashboard</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-user' ></i> */}
            <span className={style.links_name}>User</span>
          </a>
          <span className={style.tooltip}>User</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-chat' ></i> */}
            <span className={style.links_name}>Messages</span>
          </a>
          <span className={style.tooltip}>Messages</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-pie-chart-alt-2' ></i> */}
            <span className={style.links_name}>Analytics</span>
          </a>
          <span className={style.tooltip}>Analytics</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-folder' ></i> */}
            <span className={style.links_name}>File Manager</span>
          </a>
          <span className={style.tooltip}>Files</span>
        </li>
        <li>
          <a href="#">
            <i className="bx bx-cart-alt"></i>
            <span className={style.links_name}>Order</span>
          </a>
          <span className={style.tooltip}>Order</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-heart' ></i> */}
            <span className={style.links_name}>Saved</span>
          </a>
          <span className={style.tooltip}>Saved</span>
        </li>
        <li>
          <a href="#">
            {/* <i className='bx bx-cog' ></i> */}
            <span className={style.links_name}>Setting</span>
          </a>
          <span className={style.tooltip}>Setting</span>
        </li>
        <li className={style.profile}>
          <div className={style.profile_details}>
            {/* <img src="profile.jpg" alt="profileImg" /> */}
            <div className={style.name_job}>
              <div className={style.name}>Prem Shahi</div>
              <div className={style.job}>Web designer</div>
            </div>
          </div>
          {/* <i className='bx bx-log-out' id="log_out" ></i> */}
        </li>
      </ul>
    </div>
  )
};

export default Header;
