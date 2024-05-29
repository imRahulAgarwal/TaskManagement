import React from "react";

const ConfirmModal = ({ handleYes, handleNo }) => {
    return (
        <div className="z-50 absolute top-0 right-0 left-0 bottom-0 flex h-full max-w-full max-h-full w-full">
            <div className="m-auto flex flex-col gap-4 bg-white z-[102] shadow-md rounded md:w-1/3 w-2/3 p-4">
                <h2 className="md:text-xl text-lg text-center">Do you want to proceed?</h2>
                <div className="flex md:flex-row flex-col w-full gap-4 m-auto items-center justify-center">
                    <div className="flex-1 w-full">
                        <button onClick={handleYes} className="bg-red-500 w-full text-white rounded-sm py-3 hover:bg-red-600">
                            YES
                        </button>
                    </div>
                    <div className="flex-1 w-full">
                        <button onClick={handleNo} className="bg-gray-300 w-full text-black rounded-sm py-3 hover:bg-gray-400">
                            NO
                        </button>
                    </div>
                </div>
            </div>
            <div class="z-40 overflow-auto left-0 top-0 bottom-0 right-0 w-full h-full fixed bg-black opacity-50"></div>
        </div>
    );
};

export default ConfirmModal;
