import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen bg-[#F8F8F8]">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
