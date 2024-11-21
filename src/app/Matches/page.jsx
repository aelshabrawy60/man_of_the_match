"use client"
import CreateMatch from "@/Components/CreateMatch/CreateMatch";
import MatchCard from "@/Components/MatchCard/MatchCard";
import MatchesViewer from "@/Components/MatchesViewer/MatchesViewer";
import { IoAddSharp } from "react-icons/io5";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";


export default function Matches(){

    useEffect(() => {
        import('bootstrap/dist/js/bootstrap.bundle.min.js');
    }, []);

    return(
        <>  
            <div>
                <MatchesViewer/>
                <button type="button" className="p-3 add-match-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <IoAddSharp />
                </button>

                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                    <div className="modal-header mb-2 d-flex justify-content-between">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">اضافة مباراة</h1>
                        <button type="button" className="close-button fs-4" data-bs-dismiss="modal" aria-label="Close"><MdClose /></button>
                    </div>
                    <div className="modal-body">
                        <CreateMatch/>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </>
    )
}