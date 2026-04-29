import { useLocation, Link } from "react-router-dom"
import { CheckCircle, Package, Mail, CreditCard, FileText } from "lucide-react"

const OrderConfirmation = () => {
  // Get the order response from location state
  const location = useLocation()
  const order = location.state?.order

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
        <Link to="/" className="text-blue-600 underline">
          Go to Home
        </Link>
      </div>
    )
  }

  const { order_details, items, totals, reference_no, order_id } = order

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 md:p-8">
          {/* Success Header */}
          <div className="text-center mb-6 sm:mb-8">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-sm sm:text-base text-gray-600">{order.message}</p>
          </div>

          {/* Order ID & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Order Number</p>
              <p className="font-mono text-lg sm:text-xl font-bold text-gray-900 break-all">#{order_id}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5 text-center">
              <p className="text-xs sm:text-sm text-gray-600 mb-2">Reference</p>
              <p className="font-mono text-base sm:text-lg font-bold text-gray-900 break-all leading-tight">{reference_no}</p>
            </div>
          </div>

          {/* Order Items */}
          {items && items.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Order Items</h3>
                </div>
                {order_id && (
                  <a
                    href={`https://portal.hamtos.com/shop/orders?download=${order_id}&hash=${order.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#1A74BB] text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                    download
                  >
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" strokeWidth={2.5} />
                    <span>Download</span>
                  </a>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  {items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 py-2 sm:py-3 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base text-gray-900 break-words">{item.product_name}</p>
                        <div className="flex flex-wrap gap-2 sm:gap-3 mt-1">
                          <p className="text-xs sm:text-sm text-gray-600">Code: {item.product_code}</p>
                          <p className="text-xs sm:text-sm text-gray-600">Qty: {Number.parseFloat(item.quantity)}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right flex-shrink-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900">AED {Number.parseFloat(item.unit_price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center py-1.5 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Subtotal</span>
                <span className="text-sm sm:text-base text-gray-900 font-medium">AED {totals?.subtotal || order_details?.subtotal}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Product Tax</span>
                <span className="text-sm sm:text-base text-gray-900 font-medium">AED {totals?.product_tax || order_details?.product_tax}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Order Tax</span>
                <span className="text-sm sm:text-base text-gray-900 font-medium">AED {totals?.order_tax || order_details?.order_tax}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 sm:py-2">
                <span className="text-sm sm:text-base text-gray-600">Shipping</span>
                <span className="text-sm sm:text-base text-gray-900 font-medium">AED {totals?.shipping || order_details?.shipping}</span>
              </div>
              <div className="flex justify-between items-center py-2 sm:py-3 border-t border-gray-200 font-semibold text-base sm:text-lg mt-3 sm:mt-4">
                <span className="text-gray-900">Grand Total</span>
                <span className="text-gray-900">AED {totals?.grand_total || order_details?.grand_total}</span>
              </div>
            </div>
          </div>

          {/* Download Order Slip Button */}
          {order_id && order.order_hash && (
            <div className="mb-6 flex justify-center">
              <a
                href={`https://hamtos.com/shop/orders?download=${order_id}&hash=${order.order_hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1A74BB] text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors text-sm sm:text-base"
                download
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                Download Order Slip
              </a>
            </div>
          )}

          {/* Customer & Order Info */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Customer Info */}
            <div>
              <div className="flex items-center mb-2 sm:mb-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Customer Info</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                {order_details?.customer_name && (
                  <p className="text-sm sm:text-base text-gray-700">
                    <span className="font-medium">Name:</span> {order_details.customer_name}
                  </p>
                )}
                {order_details?.date && (
                  <p className="text-sm sm:text-base text-gray-700">
                    <span className="font-medium">Date:</span> {new Date(order_details.date).toLocaleDateString()}
                  </p>
                )}
                {order_details?.total_items && (
                  <p className="text-sm sm:text-base text-gray-700">
                    <span className="font-medium">Total Items:</span> {order_details.total_items}
                  </p>
                )}
              </div>
            </div>

            {/* Payment & Status Info */}
            <div>
              <div className="flex items-center mb-2 sm:mb-3">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 mr-2" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payment & Status</h3>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                {order_details?.payment_method && (
                  <p className="text-sm sm:text-base text-gray-700">
                    <span className="font-medium">Payment Method:</span>
                    <span className="capitalize ml-1">{order_details.payment_method.replace("_", " ")}</span>
                  </p>
                )}
                {order_details?.payment_status && (
                  <p className="text-sm sm:text-base text-gray-700">
                    <span className="font-medium">Payment Status:</span>
                    <span
                      className={`capitalize ml-1 font-medium ${
                        order_details.payment_status === "paid"
                          ? "text-green-600"
                          : order_details.payment_status === "pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {order_details.payment_status}
                    </span>
                  </p>
                )}
                {order_details?.sale_status && (
                  <p className="text-sm sm:text-base text-gray-700">
                    <span className="font-medium">Order Status:</span>
                    <span
                      className={`capitalize ml-1 font-medium ${
                        order_details.sale_status === "completed"
                          ? "text-green-600"
                          : order_details.sale_status === "pending"
                            ? "text-yellow-600"
                            : "text-blue-600"
                      }`}
                    >
                      {order_details.sale_status}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Tracking */}
          {/* {order.payment_urls?.order_url && (
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Track your order status:</p>
                <a
                  href={order.payment_urls.order_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  View Order Details
                </a>
              </div>
            </div>
          )} */}

          <Link
            to="/"
            className="inline-block bg-[#1A74BB] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors w-full text-center text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
