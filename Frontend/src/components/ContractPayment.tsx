import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { ArrowLeft, FileText, CreditCard, Shield, CheckCircle, Clock, Truck } from 'lucide-react';
import type { User, Screen } from '../types';

interface ContractPaymentProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

export function ContractPayment({ user, onNavigate }: ContractPaymentProps) {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const contracts = [
    {
      id: 'C001',
      partner: user?.role === 'factory' ? 'Rajesh Kumar' : 'Tech Foods Ltd.',
      crop: 'Wheat',
      quantity: '200 tons',
      totalAmount: '₹50,00,000',
      status: 'Active',
      progress: 75,
      stage: 'In Transit',
      createdDate: '2024-01-01',
      deliveryDate: '2024-01-15',
      paymentStatus: 'Partial',
      paidAmount: '₹25,00,000',
      remainingAmount: '₹25,00,000',
      paymentTerms: '50% advance, 50% on delivery',
      milestones: [
        { id: 1, title: 'Contract Signed', completed: true, date: '2024-01-01' },
        { id: 2, title: 'Advance Payment', completed: true, date: '2024-01-02' },
        { id: 3, title: 'Crop Harvested', completed: true, date: '2024-01-08' },
        { id: 4, title: 'In Transit', completed: false, date: '2024-01-12' },
        { id: 5, title: 'Delivered', completed: false, date: '2024-01-15' },
        { id: 6, title: 'Final Payment', completed: false, date: '2024-01-16' }
      ]
    },
    {
      id: 'C002',
      partner: user?.role === 'factory' ? 'Green Valley Co-op' : 'Agro Industries',
      crop: 'Rice',
      quantity: '150 tons',
      totalAmount: '₹42,00,000',
      status: 'Completed',
      progress: 100,
      stage: 'Delivered',
      createdDate: '2023-12-15',
      deliveryDate: '2024-01-05',
      paymentStatus: 'Completed',
      paidAmount: '₹42,00,000',
      remainingAmount: '₹0',
      paymentTerms: '30% advance, 70% on delivery',
      milestones: [
        { id: 1, title: 'Contract Signed', completed: true, date: '2023-12-15' },
        { id: 2, title: 'Advance Payment', completed: true, date: '2023-12-16' },
        { id: 3, title: 'Crop Harvested', completed: true, date: '2023-12-28' },
        { id: 4, title: 'In Transit', completed: true, date: '2024-01-02' },
        { id: 5, title: 'Delivered', completed: true, date: '2024-01-05' },
        { id: 6, title: 'Final Payment', completed: true, date: '2024-01-05' }
      ]
    }
  ];

  const contract = selectedContract ? contracts.find(c => c.id === selectedContract) : null;

  if (contract) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSelectedContract(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Contract {contract.id}</h1>
              <p className="text-sm text-gray-600">with {contract.partner}</p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Contract Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{contract.crop} Supply Contract</CardTitle>
                    <p className="text-gray-600">{contract.quantity} • {contract.totalAmount}</p>
                  </div>
                  <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="font-medium">{contract.createdDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Delivery Date</p>
                    <p className="font-medium">{contract.deliveryDate}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{contract.progress}%</span>
                  </div>
                  <Progress value={contract.progress} className="h-2" />
                  <p className="text-sm text-gray-600 mt-1">Current stage: {contract.stage}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Paid Amount</p>
                    <p className="text-lg font-semibold text-green-600">{contract.paidAmount}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-lg font-semibold text-orange-600">{contract.remainingAmount}</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Payment Terms</p>
                  <p className="text-sm font-medium">{contract.paymentTerms}</p>
                </div>

                {contract.paymentStatus !== 'Completed' && (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                    onClick={() => setShowPaymentModal(true)}
                  >
                    {user?.role === 'factory' ? 'Make Payment' : 'Request Payment'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contract Milestones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contract Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contract.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {milestone.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          milestone.completed ? 'text-gray-800' : 'text-gray-600'
                        }`}>
                          {milestone.title}
                        </p>
                        <p className="text-sm text-gray-500">{milestone.date}</p>
                      </div>
                      {!milestone.completed && index === contract.milestones.findIndex(m => !m.completed) && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          Current
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-800">Secure Transaction</h4>
                </div>
                <p className="text-sm text-blue-700">
                  This contract is protected by escrow services and digital verification. 
                  All payments are secured and released upon milestone completion.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Amount Due</p>
                  <p className="text-xl font-semibold">{contract.remainingAmount}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="flex-1">
                      Bank Transfer
                    </Button>
                    <Button variant="outline" className="flex-1">
                      UPI Payment
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-green-500"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  // Contract List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Contracts & Payments</h1>
            <p className="text-sm text-gray-600">Manage your agreements and transactions</p>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="p-4 space-y-4">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedContract(contract.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{contract.id}</h3>
                    <p className="text-sm text-gray-600">{contract.partner}</p>
                  </div>
                  <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                    {contract.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{contract.crop} • {contract.quantity}</span>
                    <span className="font-medium">{contract.totalAmount}</span>
                  </div>
                  <Progress value={contract.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{contract.stage}</span>
                    <span>{contract.progress}% complete</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge 
                    variant={contract.paymentStatus === 'Completed' ? 'default' : 'outline'}
                    className={contract.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                  >
                    Payment: {contract.paymentStatus}
                  </Badge>
                  <span className="text-sm text-gray-600">Due: {contract.deliveryDate}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}