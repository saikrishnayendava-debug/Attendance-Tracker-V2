import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaFilePdf } from "react-icons/fa";
import axios from 'axios'
import Add from './Add';
import Navbar from './Navbar';
import LoadingSpinner from './LoadingSpinner';

const Subject = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewPdf, setPreviewPdf] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    const branch = params.branch;
    const year = params.year;
    const subject = params.subject;

    useEffect(() => {
        load();
    }, [branch, year, subject]);

    const load = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://database-9qqy.onrender.com/pdf/${branch}/${year}/${subject}`);
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching PDFs:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = async (pdf) => {
        try {
            const response = await fetch(pdf.Url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${pdf.Title}.pdf`;
            link.setAttribute('download', `${pdf.Title}.pdf`);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            const link = document.createElement('a');
            link.href = pdf.Url;
            link.download = `${pdf.Title}.pdf`;
            link.setAttribute('download', '');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleView = (pdf) => {
        setPreviewPdf(pdf);
    };

    const closePreview = () => {
        setPreviewPdf(null);
    };

    return (
        <section className='bg-black min-h-screen relative'>
            <Add />
            <Navbar />
            <h2 className='text-slate-200 font-extrabold text-center mb-2'>{subject}</h2>
            {
                loading ? (
                    <LoadingSpinner size={40} color='emerald' text='Loading...' />
                ) : (
                    <div className='bg-black text-slate-200 flex flex-wrap justify-evenly gap-3 pb-4'>
                        {
                            data.map((pdf, index) => {
                                return (
                                    <div key={index} className='border-2 border-[#222528] p-2 h-fit rounded-lg flex flex-col items-center gap-1'>
                                        <FaFilePdf size={50} />
                                        <p className='text-xs font-bold'>{pdf.Title}</p>
                                        <div className='flex gap-2 text-xs font-bold'>
                                            <button className='bg-red-500 p-1 rounded px-2' onClick={() => handleView(pdf)}>View</button>
                                            <button className='bg-red-500 p-1 rounded px-2' onClick={() => handleDownload(pdf)}>Download</button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }



            {previewPdf && (
                <div
                    className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4'
                    onClick={closePreview}
                >
                    <div
                        className='bg-[#1a1a1a] rounded-lg w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl'
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className='flex items-center justify-between p-4 border-b border-[#222528] bg-[#0f0f0f]'>
                            <h3 className='text-slate-200 font-bold text-lg truncate pr-4'>{previewPdf.Title}</h3>
                            <button
                                onClick={closePreview}
                                className='text-slate-200 hover:text-red-500 transition-colors text-2xl font-bold min-w-[30px]'
                            >
                                ✕
                            </button>
                        </div>

                        {/* PDF Viewer */}
                        <div className='flex-1 overflow-hidden bg-gray-800'>
                            <iframe
                                src={previewPdf.Url}
                                className='w-full h-full'
                                title={previewPdf.Title}
                            />
                        </div>

                        {/* Footer with actions */}
                        <div className='p-4 border-t border-[#222528] bg-[#0f0f0f] flex gap-3 justify-end'>
                            <button
                                onClick={closePreview}
                                className='bg-red-500 text-xs text-white px-4 py-1 rounded hover:bg-gray-600 transition-colors font-bold'
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleDownload(previewPdf)}
                                className='bg-red-500 text-xs text-white px-4 py-1 rounded hover:bg-green-700 transition-colors font-bold'
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default Subject