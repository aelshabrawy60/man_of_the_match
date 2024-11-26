"use client"
import CreateMatch from "@/Components/CreateMatch/CreateMatch";
import MatchesViewer from "@/Components/MatchesViewer/MatchesViewer";
import { IoAddSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";




export default function Matches(){

    return(
        <>  
            <div>
                <button type="button" className="p-3 add-match-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                    <IoAddSharp />
                </button>
                <MatchesViewer />
                

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