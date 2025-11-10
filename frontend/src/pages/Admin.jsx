/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Plus, Edit, Trash2 ,Video} from "lucide-react";
import { NavLink } from "react-router";

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: "create",
      title: "Create Problem",
      description: "Add a new coding problem to the problem list",
      icon: Plus,
      color: "btn-success",
      bgColor: "bg-green-500/10",
      route: "/admin/create",
    },
    {
      id: "update",
      title: "Update Problem",
      description: "Edit existing problems and their details",
      icon: Edit,
      color: "btn-warning",
      bgColor: "bg-yellow-500/10",
      route: "/admin/update",
    },
    {
      id: "delete",
      title: "Delete Problem",
      description: "Remove problems from the platform",
      icon: Trash2,
      color: "btn-error",
      bgColor: "bg-red-500/10",
      route: "/admin/delete",
    },
    {
      id: "video",
      title: "Video Problems",
      description: "Upload and Delete Videos",
      icon: Video,
      color: "btn-success",
      bgColor: "bg-green-500/10",
      route: "/admin/video",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-200">
      <div className="container mx-auto px-4 py-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Admin Panel</h1>
          <p className="text-gray-400 text-lg">
            Manage coding problems on your platform
          </p>
        </div>

        {/* Option Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-gray-800/60 border border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
              >
                <div className="card-body items-center text-center p-8">
                  <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                    <IconComponent size={32} className="text-white" />
                  </div>

                  <h2 className="card-title text-xl mb-2 text-white">
                    {option.title}
                  </h2>

                  <p className="text-gray-400 mb-6">{option.description}</p>

                  <div className="card-actions">
                    <NavLink
                      to={option.route}
                      className={`btn ${option.color} btn-wide font-semibold`}
                    >
                      {option.title}
                    </NavLink>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Admin;
