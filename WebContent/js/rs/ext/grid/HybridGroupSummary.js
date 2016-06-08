Ext.ns("Rs.ext.grid");

(function() {
    /**
     * @class Rs.ext.grid.HybridGroupSummary
     * @extends Rs.ext.grid.GroupSummary Adds capability to specify the summary
     *          data for the group via json as illustrated here:
     * 
     * <pre><code>
     *  {
     *      data: [
     *          {
     *              projectId: 100,     project: 'House',
     *              taskId:    112, description: 'Paint',
     *              estimate:    6,        rate:     150,
     *              due:'06/24/2007'
     *          },
     *          ...
     *      ],
     * 
     *      groupSummaryData: {
     *          'House': {
     *              description: 14, estimate: 9,
     *                     rate: 99, due: new Date(2009, 6, 29),
     *                     cost: 999
     *          }
     *      }
     *  }
     * </code></pre>
     */
    Rs.ext.grid.HybridGroupSummary = function(config) {
        Rs.ext.grid.HybridGroupSummary.superclass.constructor.apply(this,
            arguments);
    };

    Ext.extend(Rs.ext.grid.HybridGroupSummary, Rs.ext.grid.GroupSummary, {
        /**
         * @private
         * @param {Object}
         *            rs
         * @param {Object}
         *            cs
         */
        calculate : function(rs, cs) {
            var gcol = this.view.getGroupField(), gvalue =
                    rs[0].data[gcol], gdata =
                    this.getGroupSummaryData(gvalue);
            return gdata
                || Rs.ext.grid.HybridGroupSummary.superclass.calculate.call(
                    this, rs, cs);
        },

        /**
         * <pre><code>
         * grid.on('afteredit', function() {
         *  var groupValue = 'Ext Forms: Field Anchoring';
         *  summary.showSummaryMsg(groupValue, 'Updating Summary...');
         *  setTimeout(function() { // simulate server call
         *          // HybridGroupSummary class implements updateSummaryData
         *          summary.updateSummaryData(groupValue,
         *          // create data object based on configured dataIndex
         *              {
         *                  description : 22,
         *                  estimate : 888,
         *                  rate : 888,
         *                  due : new Date(),
         *                  cost : 8
         *              });
         *      }, 2000);
         * });
         * </code></pre>
         * 
         * @param {String}
         *            groupValue
         * @param {Object}
         *            data data object
         * @param {Boolean}
         *            skipRefresh (Optional) Defaults to false
         */
        updateSummaryData : function(groupValue, data, skipRefresh) {
            var json = this.grid.getStore().reader.jsonData;
            if(!json.summaryData) {
                json.summaryData = {};
            }
            json.summaryData[groupValue] = data;
            if(!skipRefresh) {
                this.refreshSummary(groupValue);
            }
        },

        /**
         * Returns the summaryData for the specified groupValue or null.
         * 
         * @param {String}
         *            groupValue
         * @return {Object} summaryData
         */
        getGroupSummaryData : function(groupValue) {
            var reader = this.grid.getStore().reader, json =
                    reader.jsonData, fields =
                    reader.recordType.prototype.fields, v;

            if(json && json.groupSummaryData) {
                v = json.groupSummaryData[groupValue];
                if(v) {
                    return reader.extractValues(v, fields.items,
                        fields.length);
                }
            }
            return null;
        }
    });
})();
