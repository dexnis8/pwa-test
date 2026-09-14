import React from "react";
export const Brand = ({ light = false, className = "" }) => (
  <div className={`pace-brand ${light ? "pace-brand-light" : ""} ${className}`}>
    <img src="/images/logo.png" alt="" width="36" height="36" />
    <span>Pace App</span>
  </div>
);
