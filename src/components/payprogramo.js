import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";



function PayProgramo(props) {  
        function initialOptions (clientid,currency) {
      
          return ({
          "client-id": clientid,
          currency: props.currency,
          intent: "capture",
          
      });
        };
      
        return (
          <PayPalScriptProvider options={initialOptions("test")}>
              <PayPalButtons
                  createOrder={(data, actions) => {
                      return actions.order.create({
                          purchase_units: [
                              {
                                  amount: {
                                      value: props.value,
                                  },
                              },
                          ],
                      });
                  }}
                  onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                          const log = {
                            pgwclientid: props.clientid,
                            method: "PayPal",
                            id_trasaction: details.id,
                                status: details.status,
                                client: {
                                    id : details.payer.payer_id,
                                    name: details.payer.name.given_name + ' ' + details.payer.name.surname,
                                    email: details.payer.email_address,
                                    cellphone: details.payer.phone.phone_number.national_number
                                },
                                paymentinfo: {
                                    id : details.purchase_units[0].payments.captures[0].id,
                                    amount: details.purchase_units[0].amount.value,
                                    currency : details.purchase_units[0].amount.currency_code
                                },
                                payee:{
                                    id : details.purchase_units[0].payee.merchant_id,
                                    email : details.purchase_units[0].payee.email_address
                                },
                                times: {
                                    create: details.create_time,
                                    update: details.update_time
                                }
                          }
                          fetch('https://localhost:5001/api/paypal', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(log),
                        })
      
                      });
                  }}
              />
          </PayPalScriptProvider>
      );
      }
export {PayProgramo};