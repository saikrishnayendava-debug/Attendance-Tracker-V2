import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MdCancel } from "react-icons/md";
import { FaCloudUploadAlt } from "react-icons/fa";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaFilePdf } from "react-icons/fa";
import { LoaderIcon } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Form = ({ close }) => {
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const branch = params.branch;
    const year = params.year;
    const subject = params.subject;
    const [data, setData] = useState({
        branch: branch ? [branch] : [],
        year: year,
        subject: subject,
    })
    const notify = () => toast('Here is your toast.');

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const handleBranchChange = (e) => {
        const selectedBranch = e.target.value;
        if (selectedBranch && !data.branch.includes(selectedBranch)) {
            setData((prev) => ({
                ...prev,
                branch: [...prev.branch, selectedBranch]
            }));
        }
    }

    const removeBranch = (branchToRemove) => {
        setData((prev) => ({
            ...prev,
            branch: prev.branch.filter(b => b !== branchToRemove)
        }));
    }

    const handleFileChange = async (e) => {
        setLoading(true);
        const file = e.target.files[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post(
                "https://database-9qqy.onrender.com/pdf/upload",
                formData
            );

            if (response.data.success) {
                console.log(response.data);
                setData(prev => ({
                    ...prev,
                    file: response.data.data.previewLink
                }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            
            

            const promises = data.branch.map(selectedBranch =>
                axios.post("https://database-9qqy.onrender.com/pdf/submit", {
                    Branch: selectedBranch,
                    Year: data.year,
                    Subject: data.subject,
                    Title: data.title,
                    Url: data.file,
                    RedgNo: localStorage.getItem("redgNo")
                })
            );

            await Promise.all(promises);
            toast.success('Uploaded successfully!');
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            close();
        }
    }

    return (
        <section className=' fixed top-0 bottom-0 left-0 right-0 flex justify-center text-slate-200 bg-black/90'>
            <div className=' my-auto mx-auto '>
                <div className='border border-[#222528] bg-black rounded-2xl'>
                    <form action="" className='grid p-5 rounded-2xl gap-4' onSubmit={handleSubmit}>
                        <div className='flex justify-between items-center'>
                            <div className='flex justify-center items-center gap-1'>
                                <p className='font-bold text-emerald-500'>Upload Material</p>
                            </div>
                            <div>
                                <MdCancel size={20} className='text-emerald-400' onClick={close} />
                            </div>
                        </div>
                        <div className='grid grid-cols-2 w-full'>
                            <label htmlFor="branch" className='font-semibold text-sm'>Branch</label>
                            {branch ? (
                                <input
                                    type='text'
                                    id='branch'
                                    className='bg-black border border-[#222528] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-center font-semibold rounded px-2 py-1 text-sm w-30'
                                    value={branch}
                                    readOnly
                                />
                            ) : (
                                <select
                                    id='branch'
                                    className='bg-black border border-[#222528] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-center font-semibold rounded px-2 py-1 text-sm w-30'
                                    onChange={handleBranchChange}
                                    value=""
                                >
                                    <option className='text-xs font-bold' value="" disabled>Select Branch</option>
                                    <option className='text-xs font-bold' value="CSE">CSE</option>
                                    <option className='text-xs font-bold' value="ECE">ECE</option>
                                    <option className='text-xs font-bold' value="EEE">EEE</option>
                                    <option className='text-xs font-bold' value="MECH">MECH</option>
                                    <option className='text-xs font-bold' value="CIVL">CIVL</option>
                                    <option className='text-xs font-bold' value="IT">IT</option>
                                    <option className='text-xs font-bold' value="AIDS">AIDS</option>
                                    <option className='text-xs font-bold' value="CS-AI">CS-AI</option>
                                    <option className='text-xs font-bold' value="CS-D">CS-D</option>
                                    <option className='text-xs font-bold' value="CS-C">CS-C</option>
                                    <option className='text-xs font-bold' value="ECM">ECM</option>
                                </select>
                            )}
                        </div>
                        
                        {!branch && data.branch.length > 0 && (
                            <div className='flex flex-wrap gap-2'>
                                {data.branch.map((selectedBranch) => (
                                    <span
                                        key={selectedBranch}
                                        className='bg-emerald-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2'
                                    >
                                        {selectedBranch}
                                        <MdCancel
                                            size={16}
                                            className='cursor-pointer'
                                            onClick={() => removeBranch(selectedBranch)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className='grid grid-cols-2 w-full'>
                            <label htmlFor="year" className='font-semibold text-sm'>Year</label>
                            {
                                year ? (
                                    <input
                                        type='text'
                                        id='year'
                                        className='bg-black border border-[#222528] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-center font-semibold rounded px-2 py-1 text-sm w-30'
                                        value={year}
                                        readOnly
                                        required

                                    />
                                ) : (
                                    <select
                                        id='year'
                                        className='bg-black border border-[#222528] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-center font-semibold rounded px-2 py-1 text-sm w-30'
                                        onChange={handleOnChange}
                                        name="year"
                                        required
                                        value={data.year || ""}
                                    >
                                        <option className='text-xs font-bold' value="" disabled>Select Year</option>
                                        <option className='text-xs font-bold' value="1">1st</option>
                                        <option className='text-xs font-bold' value="2">2nd</option>
                                        <option className='text-xs font-bold' value="3">3rd</option>
                                        <option className='text-xs font-bold' value="4">4th</option>
                                    </select>
                                )
                            }

                        </div>



                        <div className='flex gap-2 items-center justify-evenly'>
                            <label htmlFor="subject" className='font-semibold text-sm'>Subject</label>
                            <input
                                type='text'
                                id='subject'
                                placeholder='Java'
                                className=' bg-black border border-[#222528] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-center font-semibold rounded px-2 py-1 text-sm'
                                onChange={handleOnChange}
                                name="subject"
                                value={data.subject}
                                required
                            />
                        </div>
                        <div className='flex gap-2 items-center justify-evenly'>
                            <label htmlFor="title" className='font-semibold text-sm'>Title</label>
                            <input
                                type='text'
                                id='title'
                                placeholder='UNIT-4'
                                className=' bg-black border border-[#222528] outline-none focus:outline-none focus:ring-0 focus-visible:outline-none appearance-none text-center font-semibold rounded px-2 py-1 text-sm'
                                onChange={handleOnChange}
                                name="title"
                                required
                                value={data.title}
                            />
                        </div>
                        <label htmlFor="pdf">

                            <div className=' h-30 flex items-center justify-center bg-gray-950 rounded'>
                                {
                                    loading ? (
                                        <LoadingSpinner />
                                    ) : (

                                        data?.file ? (
                                            <div className='flex flex-col items-center justify-center'>
                                                <FaFilePdf size={25} />
                                                <p className='text-xs font-bold text-green-400'>File Uploaded</p>
                                            </div>
                                        ) : (
                                            <FaCloudUploadAlt size={25} />
                                        )

                                    )
                                }
                                <input required type="file" id='pdf' hidden onChange={handleFileChange} />
                            </div>

                        </label>

                        <button className='bg-emerald-500 text-black cursor-pointer rounded py-1.5 font-bold text-sm'>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Form
