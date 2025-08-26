import React, { useState } from 'react';
import { PAYSTACK_PUBLIC_KEY } from '../../paystack';
import { ArrowLeft, CreditCard, Smartphone, Star, Zap, Shield, Gift, Users, Clock } from 'lucide-react';
import { VotePack } from '../../types';
import { useAuthStore } from '../../store/auth';

interface VotePacksPageProps {
  onBack: () => void;
}

const votePacks: VotePack[] = [
  {
    id: '1',
    name: 'Starter Pack',
    price: 35,
    votes: 20
  },
  {
    id: '2',
    name: 'Popular Pack',
    price: 60,
    votes: 50,
    popular: true
  },
  {
    id: '3',
    name: 'Power Pack',
    price: 100,
    votes: 100
  }
];

export const VotePacksPage: React.FC<VotePacksPageProps> = ({ onBack }) => {
  const [selectedPack, setSelectedPack] = useState<VotePack | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'stripe' | 'momo'>('paystack');
  const [showCheckout, setShowCheckout] = useState(false);
  const { addVotes, user } = useAuthStore();

  const handlePurchase = (pack: VotePack) => {
    setSelectedPack(pack);
    setShowCheckout(true);
  };

  const handlePayment = () => {
    if (!selectedPack) return;

    if (paymentMethod === 'paystack') {
      if (!document.getElementById('paystack-script')) {
        const script = document.createElement('script');
        script.id = 'paystack-script';
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        script.onload = () => payWithPaystack();
      } else {
        payWithPaystack();
      }
      return;
    }

    // Simulate other payment methods
    setTimeout(() => {
      addVotes(selectedPack.votes);
      setShowCheckout(false);
      setSelectedPack(null);
      alert(`Successfully purchased ${selectedPack.votes} votes!`);
    }, 2000);
  };

  function payWithPaystack() {
    if (!selectedPack) return;
    // @ts-ignore
    const handler = window.PaystackPop && window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: user?.email || 'user@email.com',
      amount: selectedPack.price * 100,
      currency: 'GHS',
      label: user?.name || undefined,
      ref: `VOTEUPGH_${user?.id || 'guest'}_${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: user?.name || 'Guest',
            variable_name: 'votes',
            value: selectedPack.votes
          },
          {
            display_name: 'Vote Pack',
            variable_name: 'pack',
            value: selectedPack.name
          }
        ]
      },
      callback: function(response: any) {
        addVotes(selectedPack.votes);
        setShowCheckout(false);
        setSelectedPack(null);
        alert('Payment complete! Transaction ref: ' + response.reference);
      },
      onClose: function() {
        alert('Payment window closed');
      }
    });
    if (handler) handler.openIframe();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-10">
          <button
            onClick={onBack}
            className="flex items-center text-indigo-700 hover:text-indigo-900 font-medium transition-colors duration-200 p-2 rounded-lg hover:bg-indigo-50"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Support Your Favorites
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Purchase vote packs to support your favorite contestants. All prices are in Ghanaian Cedis (GHS).
          </p>
        </div>

        {!showCheckout ? (
          <>
            {/* Vote Packs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {votePacks.map((pack, i) => (
                <div
                  key={pack.id}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    pack.popular ? 'ring-2 ring-yellow-400 transform -translate-y-2' : ''
                  }`}
                >
                  {pack.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center">
                      <Star className="h-4 w-4 mr-1" fill="white" />
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Zap className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                      <div className="text-4xl font-bold text-indigo-700 mb-1">GHS {pack.price}</div>
                      <p className="text-lg text-gray-600">{pack.votes} votes</p>
                    </div>
                    
                    <div className="mb-6 bg-gray-50 rounded-lg p-4">
                      <p className="text-center text-gray-700 font-medium">
                        <span className="text-indigo-600 font-bold">GHS {(pack.price / pack.votes).toFixed(2)}</span> per vote
                      </p>
                    </div>
                    
                    <button
                      onClick={() => handlePurchase(pack)}
                      className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors duration-200 ${
                        pack.popular
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Features Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Buy Vote Packs?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Support Contestants</h3>
                  <p className="text-gray-600 text-sm">Help your favorites get the votes they need to succeed</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vote Anytime</h3>
                  <p className="text-gray-600 text-sm">No waiting periods - use votes whenever you want</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fair Pricing</h3>
                  <p className="text-gray-600 text-sm">Transparent pricing with better rates for larger packs</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
                  <p className="text-gray-600 text-sm">Safe payment processing with multiple options</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Checkout Section */
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Purchase</h2>
            
            {selectedPack && (
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedPack.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{selectedPack.votes} votes</span>
                  <span className="text-2xl font-bold text-indigo-700">GHS {selectedPack.price}</span>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h4>
              
              <div className="space-y-4">
                <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                  <input
                    type="radio"
                    name="payment"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'paystack')}
                    className="mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium">Paystack</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Card, Mobile Money, Bank Transfer</p>
                  </div>
                </label>
                
                <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                    className="mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Stripe (Test Mode)</p>
                  </div>
                </label>
                
                <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors duration-200">
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'momo')}
                    className="mt-1 mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-yellow-600 mr-3" />
                      <span className="font-medium">Mobile Money</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">MTN/Vodafone/AirtelTigo (Demo)</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowCheckout(false)}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Back to Packs
              </button>
              <button
                onClick={handlePayment}
                className="flex-1 py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Pay GHS {selectedPack?.price}
              </button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-1" />
                <span>Secure payment processing</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">This is a demo. No real charges will be made.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};