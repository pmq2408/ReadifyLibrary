import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

export const RulesPage = () => {
    const rulesList = [
        { id: 1, title: "Nội quy Thư viện", content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis obcaecati maxime dignissimos fuga reprehenderit similique animi atque aliquam laudantium error. Incidunt nesciunt repellat atque ipsa laudantium molestiae, quibusdam cum iste. Nội quy thư viện gồm các quy tắc chung... " },
        { id: 2, title: "Dịch vụ mượn, trả tài liệu", content: "Bạn có thể mượn tối đa 5 quyển sách..." },
        { id: 3, title: "Hướng dẫn bạn đọc xem sách đang mượn, tự gia hạn sách", content: "Bạn có thể gia hạn sách qua hệ thống online..." },
        { id: 4, title: "Quy định sử dụng phòng học nhóm trong thư viện", content: "Phòng học nhóm cần được đặt trước..." },
        { id: 5, title: "Hướng dẫn thanh toán phí thư viện", content: "Thanh toán có thể thực hiện qua cổng thanh toán online..." },
        { id: 6, title: "Xử lý vi phạm nội quy thư viện", content: "Vi phạm nội quy có thể dẫn đến đình chỉ quyền sử dụng thư viện..." },
    ];

    const [selectedRule, setSelectedRule] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (rule) => {
        setSelectedRule(rule);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedRule(null);
    };

    return (
        <div className="p-4 bg-white border rounded-lg shadow-md mt-5 mx-auto" style={{ width: "1250px" }}>
            <h2 className="text-2xl font-bold mb-4 text-center">Nội quy Thư viện</h2>
            <table className="w-full border border-gray-300 text-base">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="p-3 text-center font-semibold w-16">STT</th>
                        <th className="p-3 text-left font-semibold">Tiêu đề</th>
                    </tr>
                </thead>
                <tbody>
                    {rulesList.map((rule) => (
                        <tr
                            key={rule.id}
                            className="border-t border-gray-300 hover:bg-gray-50 cursor-pointer"
                            onClick={() => openModal(rule)}
                        >
                            <td className="p-3 text-center">{rule.id}</td>
                            <td className="p-3 text-blue-600 font-medium hover:underline">{rule.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal Popup */}
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
                        <Dialog.Title className="text-xl font-semibold">{selectedRule?.title}</Dialog.Title>
                        <Dialog.Description className="mt-2 text-gray-700">
                            {selectedRule?.content}
                        </Dialog.Description>
                        <button
                            onClick={closeModal}
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Đóng
                        </button>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};
