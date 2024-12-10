import { useState } from 'react'
import { LuShare2 } from "react-icons/lu";
import { IoMdCopy } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { IoMdDoneAll } from "react-icons/io";
import { LuShare } from "react-icons/lu";
import { RxShare2 } from "react-icons/rx";

import './Share.css'

function Share({link}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);

        // Reset the "copied" state after 2 seconds
        setTimeout(() => setCopied(false), 3000);
    };
  return (
    <>
        <button type="button" className="share-btn gradient-btn" data-bs-toggle="modal" data-bs-target="#shareModal">
            <RxShare2 className='fs-3'/>
        </button>

        <div className="modal fade" id="shareModal" tabIndex="-1" aria-labelledby="shareModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header d-flex justify-content-between">
                        <h1 className="modal-title fs-5" id="shareModalLabel">مشاركة المباراة</h1>
                        <button type="button"  className="close-button fs-4" data-bs-dismiss="modal" aria-label="Close"><MdClose /></button>
                    </div>
                    <div className="modal-body text-center">
                        <div className='py-4'>{link}</div>
                        <button className='copy-btn gradient-btn border-0 p-2 px-3' onClick={() => handleCopy()}>
                                {!copied ? <><IoMdCopy className='fs-4 ms-2'/>نسخ الرابط </>:<><IoMdDoneAll className='fs-4 ms-2' /> تم  </>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Share