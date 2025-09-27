import React, { useState, useEffect } from "react";
import { BiError } from "react-icons/bi";
import { SlCheck } from "react-icons/sl";
import { BiSolidError } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import "./Notification.css";

const Notification = ({
  message,
  type = "success",
  isVisible = true,
  onClose,
  autoCloseTime = 5000
}) => {
  const [show, setShow] = useState(isVisible);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const styles = getNotificationStyles(type);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && autoCloseTime > 0) {
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
        setTimeout(() => {
          setShow(false);
          setIsAnimatingOut(false);
          onClose?.();
        }, 300);
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [show, autoCloseTime, onClose]);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setShow(false);
      setIsAnimatingOut(false);
      onClose?.();
    }, 300);
  };

  if (!show) return null;

  return (
    <div className={`
      ${isAnimatingOut ? 'animate-slideOutTop' : 'animate-slideInTop'}
      w-full
    `}>
      <div className={`
        bg-background-input border border-border
        w-full py-3 px-4 rounded-lg shadow-lg
        flex items-center justify-between
      `}>
        <div className="flex items-center flex-1">
          <span className={`${styles.icon} mr-3 text-xl flex-shrink-0 p-3 rounded-full ${styles.background}`}>
            {icons[type]}
          </span>
          <p className={`text-text text-sm leading-relaxed`}>
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className={`
            ml-3 flex-shrink-0 p-1 rounded-full cursor-pointer
            ${styles.closeButton}
          `}
          aria-label="Fechar notificação"
        >
          <IoMdClose className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const icons = {
  success: <SlCheck className="w-5"/>,
  error: <BiError className="w-5"/>,
  warning: <BiSolidError className="w-5"/>,
};

const getNotificationStyles = (type) => {
  const styleMap = {
    success: {
      background: "bg-sucess/10",
      icon: "text-sucess",
      closeButton: "text-sucess hover:text-sucess"
    },
    error: {
      background: "bg-danger/10",
      icon: "text-danger",
      closeButton: "text-danger hover:text-danger-hover"
    },
    warning: {
      background: "bg-warning/10",
      icon: "text-warning",
      closeButton: "text-warning hover:text-warning"
    }
  };

  return styleMap[type] || styleMap.success;
};

export default Notification;
